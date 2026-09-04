alter type public.subscription_status add value if not exists 'expired';
alter table public.audits add column if not exists is_public boolean not null default false;
alter table public.audits add column if not exists share_token uuid not null default gen_random_uuid();
create unique index if not exists audits_share_token_idx on public.audits(share_token);
