-- OffMic — initial schema
-- Single table: interviews. Owner is a journalist (auth.users).
-- Source upload goes through a server action that validates the token
-- (RLS denies all anon writes; row mutation reserved to service role / server).

create extension if not exists "pgcrypto";

create table public.interviews (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  token           text not null unique,
  question        text not null,
  ciphertext_path text,
  iv              text,
  hash_sha256     text,
  expires_at      timestamptz not null,
  created_at      timestamptz not null default now(),
  submitted_at    timestamptz,
  opened_at       timestamptz
);

create index interviews_owner_id_created_at_idx
  on public.interviews (owner_id, created_at desc);

alter table public.interviews enable row level security;

-- Owner can read own rows.
create policy "interviews_select_own"
  on public.interviews for select
  using (auth.uid() = owner_id);

-- Owner can create own rows.
create policy "interviews_insert_own"
  on public.interviews for insert
  with check (auth.uid() = owner_id);

-- Owner can update own rows (e.g. opened_at, expiry extension).
create policy "interviews_update_own"
  on public.interviews for update
  using (auth.uid() = owner_id);

-- Owner can delete own rows.
create policy "interviews_delete_own"
  on public.interviews for delete
  using (auth.uid() = owner_id);

-- No anon policy: source upload path bypasses RLS via service-role server action.
