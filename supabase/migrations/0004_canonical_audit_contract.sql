-- Canonical AI audit contract: Critical / Major / Minor and visualHierarchy.
alter type public.issue_severity add value if not exists 'major';
alter type public.issue_severity add value if not exists 'minor';

alter table public.audit_issues drop constraint if exists audit_issues_category_check;
update public.audit_issues set category = 'visualHierarchy' where category = 'hierarchy';
alter table public.audit_issues add constraint audit_issues_category_check
  check (category in ('usability','accessibility','visualHierarchy','consistency','uxWriting'));
