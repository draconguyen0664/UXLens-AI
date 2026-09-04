alter table public.audits
  add column if not exists image_paths text[] not null default '{}'::text[];

update public.audits
set image_paths = array[image_path]
where cardinality(image_paths) = 0;

comment on column public.audits.image_paths is
  'Private Storage object paths for all screenshots analyzed in this audit.';
