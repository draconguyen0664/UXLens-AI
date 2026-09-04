alter type public.audit_status add value if not exists 'pending' before 'processing';

alter table public.audits alter column image_path drop not null;
alter table public.audits add column if not exists error_message text;
alter table public.audits add column if not exists product_type text;
alter table public.audits add column if not exists platform text;
alter table public.audits add column if not exists screen_type text;
alter table public.audits add column if not exists updated_at timestamptz not null default now();

create index if not exists audits_user_status_created_idx on public.audits(user_id, status, created_at desc);

create or replace function public.consume_audit_usage(target_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
  is_pro boolean;
begin
  if auth.uid() is distinct from target_user_id then raise exception 'forbidden'; end if;

  select exists(
    select 1 from public.subscriptions
    where user_id = target_user_id
      and status in ('active', 'trialing')
      and plan <> 'free'
      and (current_period_end is null or current_period_end > now())
  ) into is_pro;

  insert into public.usage(user_id, period, audit_count)
  values (target_user_id, to_char(now(), 'YYYY-MM'), 0)
  on conflict (user_id, period) do nothing;

  select audit_count into current_count
  from public.usage
  where user_id = target_user_id and period = to_char(now(), 'YYYY-MM')
  for update;

  if not is_pro and current_count >= 3 then raise exception 'free_quota_exceeded'; end if;

  update public.usage
  set audit_count = audit_count + 1
  where user_id = target_user_id and period = to_char(now(), 'YYYY-MM')
  returning audit_count into current_count;

  return current_count;
end;
$$;
