// Review comments of the prototype. With VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time (the public anon
// key; prototype/.env.local, git-ignored) comments go to the project's Supabase table prototype_comments, shared by
// every reviewer, through its REST API (no client library). Without them the prototype keeps comments in this
// browser only ("local test store"), so the overlay works before Supabase exists. Reviewers need no account.
import { PROJECT } from '../generated/routes';

export type Comment = {
  id: string;
  project: string;
  screen: string;
  figma_node: string | null;
  component: string | null;
  theme: string;
  lang: string;
  viewport: string;
  x: number;
  y: number;
  author: string | null;
  body: string;
  status: 'open' | 'resolved';
  created_at: string;
};
export type NewComment = Omit<Comment, 'id' | 'project' | 'status' | 'created_at'>;

const env = import.meta.env;
const URL_ = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const KEY = env.VITE_SUPABASE_ANON_KEY || '';
export const COMMENTS_PROJECT: string = env.VITE_COMMENTS_PROJECT
  || PROJECT.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const storeKind: 'shared' | 'local' = URL_ && KEY ? 'shared' : 'local';

const api = `${URL_}/rest/v1/prototype_comments`;
// Legacy anon keys are JWTs and also go in Authorization; the newer publishable keys (sb_publishable_...) only in apikey.
const headers: Record<string, string> = { apikey: KEY, 'content-type': 'application/json', ...(KEY.startsWith('eyJ') ? { Authorization: `Bearer ${KEY}` } : {}) };
const LOCAL = `fp-comments-${COMMENTS_PROJECT}`;

function readLocal(): Comment[] {
  try { return JSON.parse(window.localStorage.getItem(LOCAL) || '[]'); } catch { return []; }
}
function writeLocal(list: Comment[]) {
  try { window.localStorage.setItem(LOCAL, JSON.stringify(list)); } catch { /* private mode: kept for this visit only */ }
}
let memory: Comment[] | null = null;

export async function listComments(screen: string): Promise<Comment[]> {
  if (storeKind === 'local') return (memory ??= readLocal()).filter((c) => c.screen === screen);
  const q = `?select=*&project=eq.${encodeURIComponent(COMMENTS_PROJECT)}&screen=eq.${encodeURIComponent(screen)}&order=created_at.asc`;
  const r = await fetch(api + q, { headers });
  if (!r.ok) throw new Error(`Could not load comments (HTTP ${r.status})`);
  return r.json();
}

export async function addComment(c: NewComment): Promise<Comment> {
  const row = { ...c, project: COMMENTS_PROJECT, status: 'open' as const };
  if (storeKind === 'local') {
    const made: Comment = { ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    memory = [...(memory ??= readLocal()), made];
    writeLocal(memory);
    return made;
  }
  const r = await fetch(api, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify(row) });
  if (!r.ok) throw new Error(`Could not post the comment (HTTP ${r.status})`);
  return (await r.json())[0];
}
