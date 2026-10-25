// Comments panel: the comments of the current screen (resolved ones hidden unless asked) and the form for a new one.
// With Comment on, a tap on the screen drops a pin there and opens the form; the comment keeps the element's Figma node,
// DS component, theme, language and viewport. Desktop: a side panel. Phone width: a bottom sheet.
import React from 'react';
import type { Comment } from './comments';
import { storeKind } from './comments';

export type Pending = { x: number; y: number; figma_node: string | null; component: string | null };

function remembered(): string {
  try { return window.localStorage.getItem('fp-comment-author') || ''; } catch { return ''; }
}

export function CommentsPanel({ comments, pending, narrow, selected, error, onSubmit, onCancel, onSelect, onClose }: {
  comments: Comment[]; pending: Pending | null; narrow: boolean; selected: string | null; error: string | null;
  onSubmit: (body: string, author: string) => Promise<void>; onCancel: () => void; onSelect: (id: string) => void; onClose: () => void;
}) {
  const [body, setBody] = React.useState('');
  const [author, setAuthor] = React.useState(remembered);
  const [busy, setBusy] = React.useState(false);
  const [showResolved, setShowResolved] = React.useState(false);
  const text = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => { if (pending) text.current?.focus(); }, [pending]);

  const shown = comments.filter((c) => showResolved || c.status !== 'resolved');
  const resolved = comments.length - comments.filter((c) => c.status !== 'resolved').length;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || busy) return;
    setBusy(true);
    try {
      try { window.localStorage.setItem('fp-comment-author', author.trim()); } catch { /* ignore */ }
      await onSubmit(body.trim(), author.trim());
      setBody('');
    } finally { setBusy(false); }
  };

  const frame = narrow
    ? 'fixed inset-x-0 bottom-0 z-30 flex h-[60vh] flex-col rounded-t-2xl border-t border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900'
    : 'flex w-[360px] shrink-0 flex-col border-l border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900';
  const field = 'box-border w-full rounded-md border border-black/15 bg-transparent px-2.5 py-1.5 text-sm text-inherit dark:border-white/15';

  return (
    <aside className={frame} aria-label="Comments" data-comments-panel={narrow ? 'sheet' : 'side'}>
      {narrow && <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 rounded-full bg-black/20 dark:bg-white/25" />}
      <div className="flex items-start gap-2 px-4 pb-2 pt-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Comments <span className="opacity-60">({shown.length})</span></div>
          <div className="text-xs opacity-60" data-store={storeKind}>
            {storeKind === 'shared' ? 'Shared with everyone who opens this link.' : 'Local test store: only in this browser.'}
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close comments"
          className="rounded-md bg-transparent px-2 py-1 text-xs opacity-70 hover:bg-black/5 dark:hover:bg-white/10">✕</button>
      </div>

      {pending ? (
        <form onSubmit={submit} className="mx-4 mb-3 rounded-lg border border-indigo-400/60 p-3" data-comment-form="">
          <div className="mb-2 text-xs opacity-70">New comment on <b>{pending.component || 'Frame'}</b> · {pending.figma_node || '-'}</div>
          <label className="mb-2 block text-xs">
            <span className="mb-1 block opacity-70">Name (optional)</span>
            <input value={author} maxLength={80} onChange={(e) => setAuthor(e.target.value)} className={field} autoComplete="name" />
          </label>
          <label className="block text-xs">
            <span className="mb-1 block opacity-70">Comment</span>
            <textarea ref={text} value={body} required maxLength={2000} rows={3} onChange={(e) => setBody(e.target.value)} className={field} />
          </label>
          {error && <div role="alert" className="mt-2 text-xs text-red-500">{error}</div>}
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md bg-transparent px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={!body.trim() || busy}
              className="rounded-md bg-indigo-500 px-3 py-1 text-xs font-medium text-white disabled:opacity-40">{busy ? 'Posting…' : 'Post'}</button>
          </div>
        </form>
      ) : (
        <div className="mx-4 mb-3 rounded-lg bg-black/5 px-3 py-2 text-xs opacity-80 dark:bg-white/10">Tap an element on the screen to comment on it.</div>
      )}

      <div className="flex items-center justify-between border-t border-black/10 px-4 py-2 text-xs dark:border-white/10">
        <span className="opacity-60">This screen</span>
        {resolved > 0 && (
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Show resolved ({resolved})
          </label>
        )}
      </div>
      <ol className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0 pb-3" data-comment-list="">
        {!shown.length && <li className="px-4 py-2 text-xs opacity-60">No comments on this screen yet.</li>}
        {shown.map((c) => {
          const n = comments.indexOf(c) + 1;
          return (
            <li key={c.id}>
              <button type="button" onClick={() => onSelect(c.id)} data-comment-id={c.id}
                className={`box-border flex w-full gap-3 px-4 py-2 text-left ${selected === c.id ? 'bg-indigo-400/15' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${c.status === 'resolved' ? 'bg-neutral-500' : 'bg-indigo-500'}`}>{n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs opacity-60">{c.author || 'Anonymous'} · {new Date(c.created_at).toLocaleString()}</span>
                  <span className="block whitespace-pre-wrap break-words text-sm" dir="auto">{c.body}</span>
                  <span className="block text-[11px] opacity-50">{c.component || 'Frame'} · {c.figma_node} · {c.theme} / {c.lang.toUpperCase()} · {c.viewport}{c.status === 'resolved' ? ' · resolved' : ''}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
