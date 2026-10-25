-- Live Prototype comments (Screens_Handoff_Skill, step 4). Run once in the Supabase SQL Editor of the test project.
-- tools/prototype_comments.cjs --schema writes this file for a project with {{PROJECT}} filled in.
-- Reviewers post from the public prototype with the anon key: they can add a comment and read the comments of this
-- project only. Nobody with the anon key can change or delete a comment; triage (--pull) and --resolve use the
-- service key, which stays in the owner's local .env.local and bypasses these policies.

create table if not exists public.prototype_comments (
  id          uuid primary key default gen_random_uuid(),
  project     text not null,
  screen      text not null,                    -- prototype screen slug (e.g. now-playing)
  figma_node  text,                             -- data-figma-node of the element (Figma node id in the Design file)
  component   text,                             -- DS component name, or the frame name
  theme       text check (theme in ('Light', 'Dark')),
  lang        text check (lang in ('en', 'ar')),
  viewport    text,                             -- e.g. "desktop 1280x900" / "phone 390x844"
  x           real,                             -- pin position in the screen, Figma pixels
  y           real,
  author      text check (char_length(author) <= 80),
  body        text not null check (char_length(body) between 1 and 2000),
  status      text not null default 'open' check (status in ('open', 'resolved')),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists prototype_comments_project_screen on public.prototype_comments (project, screen, created_at);

alter table public.prototype_comments enable row level security;

drop policy if exists "anon reads this project's comments" on public.prototype_comments;
create policy "anon reads this project's comments" on public.prototype_comments
  for select to anon
  using (project = '{{PROJECT}}');

drop policy if exists "anon adds open comments to this project" on public.prototype_comments;
create policy "anon adds open comments to this project" on public.prototype_comments
  for insert to anon
  with check (project = '{{PROJECT}}' and status = 'open' and resolved_at is null);

-- No update or delete policy for anon: with RLS on, those are refused.
revoke update, delete, truncate on public.prototype_comments from anon;
grant select, insert on public.prototype_comments to anon;
