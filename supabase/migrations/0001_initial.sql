create extension if not exists "pgcrypto";

create type public.audit_status as enum ('processing', 'completed', 'failed');
create type public.issue_severity as enum ('critical', 'high', 'medium', 'low');
create type public.subscription_status as enum ('active', 'trialing', 'past_due', 'canceled', 'incomplete');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, avatar_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.projects (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, name text not null check (char_length(name) between 1 and 120), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.audits (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, project_id uuid not null references public.projects(id) on delete cascade, image_path text not null, image_paths text[] not null default '{}'::text[], context text, status public.audit_status not null default 'processing', overall_score smallint check (overall_score between 0 and 100), scores jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table public.audit_issues (id uuid primary key default gen_random_uuid(), audit_id uuid not null references public.audits(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, position smallint not null default 0, severity public.issue_severity not null, category text not null check (category in ('usability','accessibility','hierarchy','consistency','uxWriting')), title text not null, location text not null, problem text not null, why_it_matters text not null, recommendation text not null, created_at timestamptz not null default now());
create table public.usage (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, period text not null check (period ~ '^\d{4}-\d{2}$'), audit_count integer not null default 0 check (audit_count >= 0), created_at timestamptz not null default now(), unique(user_id, period));
create table public.subscriptions (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade, provider text not null check (provider in ('stripe','lemon_squeezy')), provider_customer_id text, provider_subscription_id text unique, status public.subscription_status not null, plan text not null, current_period_end timestamptz, updated_at timestamptz not null default now());
create table public.payment_events (id uuid primary key default gen_random_uuid(), provider text not null, provider_event_id text not null unique, event_type text not null, payload jsonb not null, processed_at timestamptz, created_at timestamptz not null default now());

create index projects_user_id_idx on public.projects(user_id);
create index audits_user_created_idx on public.audits(user_id, created_at desc);
create index audits_project_idx on public.audits(project_id, created_at desc);
create index audit_issues_audit_idx on public.audit_issues(audit_id, position);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.audits enable row level security;
alter table public.audit_issues enable row level security;
alter table public.usage enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "projects_own" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "audits_own" on public.audits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "audit_issues_own" on public.audit_issues for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usage_read_own" on public.usage for select using (auth.uid() = user_id);
create policy "subscriptions_read_own" on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$ begin insert into public.profiles (id, full_name, avatar_url) values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url'); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.increment_audit_usage(target_user_id uuid) returns void language plpgsql security definer set search_path = '' as $$ begin if auth.uid() is distinct from target_user_id then raise exception 'forbidden'; end if; insert into public.usage(user_id, period, audit_count) values (target_user_id, to_char(now(), 'YYYY-MM'), 1) on conflict (user_id, period) do update set audit_count = public.usage.audit_count + 1; end; $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('screenshots', 'screenshots', false, 8388608, array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "screenshots_select_own" on storage.objects for select using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "screenshots_insert_own" on storage.objects for insert with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "screenshots_delete_own" on storage.objects for delete using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
