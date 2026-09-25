-- v3.2 Stable / v5 feedback groundwork
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('idea','bug','confusing','data','other')),
  title text not null,
  message text not null,
  contact text,
  page_version text,
  status text not null default 'new' check (status in ('new','reviewing','considered','implemented','dismissed')),
  created_at timestamptz not null default now()
);
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.feedback enable row level security;
alter table public.app_admins enable row level security;
drop policy if exists "feedback_insert_anyone" on public.feedback;
create policy "feedback_insert_anyone" on public.feedback for insert to anon, authenticated with check (user_id is null or user_id = auth.uid());
drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own" on public.feedback for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.app_admins a where a.user_id=auth.uid()));
drop policy if exists "feedback_admin_update" on public.feedback;
create policy "feedback_admin_update" on public.feedback for update to authenticated using (exists(select 1 from public.app_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.app_admins a where a.user_id=auth.uid()));
drop policy if exists "admins_read_self" on public.app_admins;
create policy "admins_read_self" on public.app_admins for select to authenticated using (user_id=auth.uid());
-- After you have logged into the app once, make yourself admin from SQL Editor by replacing the email:
-- insert into public.app_admins(user_id) select id from auth.users where email='TU_CORREO' on conflict do nothing;
