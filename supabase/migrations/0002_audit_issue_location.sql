alter table public.audit_issues add column if not exists location text;
update public.audit_issues set location = 'Không xác định' where location is null;
alter table public.audit_issues alter column location set not null;
comment on column public.audit_issues.location is 'Human-readable visual location of the issue within the audited screenshot.';