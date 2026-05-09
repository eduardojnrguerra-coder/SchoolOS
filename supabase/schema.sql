-- Pine X School OS baseline schema.
-- IMPORTANT: RLS policies below are starter placeholders for development.
-- Production launch must include a careful security review by the school/operator.
-- Parent users must never be able to view other families' learner data.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_code text,
  country_code text default 'ZA',
  province text,
  town text,
  timezone text default 'Africa/Johannesburg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  auth_user_id uuid unique,
  full_name text not null,
  email text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text not null check (role in ('SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER','FINANCE','TRANSPORT_MANAGER','AFTERCARE_STAFF','PARENT')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists grades (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  code text not null,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  grade_id uuid references grades(id) on delete set null,
  class_code text not null,
  class_name text not null,
  room_label text,
  teacher_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists learners (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_code text,
  first_name text not null,
  last_name text not null,
  preferred_name text,
  grade_id uuid references grades(id) on delete set null,
  class_id uuid references classes(id) on delete set null,
  enrollment_date date,
  status text not null default 'ACTIVE',
  medical_alert_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  full_name text not null,
  relationship text,
  email text,
  phone text,
  receives_billing boolean not null default false,
  is_primary_contact boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists learner_parents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  parent_id uuid not null references parents(id) on delete cascade,
  custody_level text,
  pickup_authorized boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, parent_id)
);

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  employee_code text,
  specialization text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table classes add constraint classes_teacher_fk foreign key (teacher_id) references teachers(id) on delete set null;

create table if not exists class_learners (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, learner_id, start_date)
);

create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  class_id uuid references classes(id) on delete set null,
  attendance_date date not null,
  status text not null check (status in ('PRESENT','ABSENT','LATE','LEFT_EARLY','SICK_BAY','EXCUSED')),
  note text,
  captured_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, attendance_date)
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  body text not null,
  priority text not null default 'NORMAL',
  created_by uuid references users(id) on delete set null,
  scheduled_for timestamptz,
  published_at timestamptz,
  expires_at timestamptz,
  attachment_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notice_audiences (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  notice_id uuid not null references notices(id) on delete cascade,
  audience_type text not null,
  target_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  title text not null,
  body text not null,
  channel text not null default 'IN_APP',
  delivery_status text not null default 'PENDING',
  read_at timestamptz,
  action_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fee_accounts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  account_code text,
  billing_cycle text not null default 'MONTHLY',
  currency text not null default 'ZAR',
  current_balance numeric(12,2) not null default 0,
  overdue_amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  fee_account_id uuid not null references fee_accounts(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'ZAR',
  method text not null,
  reference text,
  provider text,
  provider_reference text,
  paid_at timestamptz,
  captured_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists proof_of_payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  payment_id uuid references payments(id) on delete set null,
  fee_account_id uuid references fee_accounts(id) on delete cascade,
  uploaded_by uuid references users(id) on delete set null,
  file_path text not null,
  status text not null default 'PENDING',
  verified_by uuid references users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consent_forms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  description text,
  event_id uuid,
  due_at timestamptz,
  audience_type text,
  audience_target_id uuid,
  requires_signature boolean not null default true,
  indemnity_text text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consent_questions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  consent_form_id uuid not null references consent_forms(id) on delete cascade,
  question_text text not null,
  question_type text not null,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consent_submissions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  consent_form_id uuid not null references consent_forms(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  parent_id uuid references parents(id) on delete set null,
  status text not null default 'SENT',
  answers jsonb not null default '{}'::jsonb,
  signature_text text,
  accepted_at timestamptz,
  accepted_by_user_id uuid references users(id) on delete set null,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  audience_type text,
  audience_target_id uuid,
  cost numeric(12,2),
  consent_required boolean not null default false,
  attachment_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  category text not null,
  visibility_type text not null,
  visibility_target_id uuid,
  storage_bucket text not null default 'documents',
  storage_path text not null,
  viewed_count int not null default 0,
  downloaded_count int not null default 0,
  uploaded_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists incident_reports (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  incident_type text not null,
  severity text not null,
  notes text,
  parent_notified boolean not null default false,
  follow_up_required boolean not null default false,
  parent_visible boolean not null default false,
  reported_by uuid references users(id) on delete set null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists transport_vehicles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  label text not null,
  registration_code text,
  capacity int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  full_name text not null,
  phone text,
  license_code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists transport_routes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  route_code text,
  route_name text not null,
  vehicle_id uuid references transport_vehicles(id) on delete set null,
  driver_id uuid references drivers(id) on delete set null,
  status text not null default 'NOT_STARTED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists transport_stops (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  route_id uuid not null references transport_routes(id) on delete cascade,
  stop_name text not null,
  sequence int not null default 0,
  pickup_time time,
  dropoff_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists learner_transport_assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  route_id uuid not null references transport_routes(id) on delete cascade,
  stop_id uuid references transport_stops(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists transport_status_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  route_id uuid references transport_routes(id) on delete cascade,
  learner_id uuid references learners(id) on delete cascade,
  status text not null,
  note text,
  logged_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aftercare_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  session_date date not null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  supervisor_user_id uuid references users(id) on delete set null,
  meal_notes text,
  homework_notes text,
  late_fee_amount numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists aftercare_pickups (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  aftercare_session_id uuid not null references aftercare_sessions(id) on delete cascade,
  collected_by_name text not null,
  relationship text,
  pickup_pin_hash text,
  verified_by uuid references users(id) on delete set null,
  pickup_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists message_threads (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  subject text not null,
  category text,
  created_by uuid references users(id) on delete set null,
  participant_user_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_user_id uuid references users(id) on delete set null,
  body text not null,
  read_by_user_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  reason text,
  ip_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'schools','users','user_roles','learners','parents','learner_parents','teachers','grades','classes','class_learners',
    'attendance_records','notices','notice_audiences','notifications','fee_accounts','payments','proof_of_payments',
    'consent_forms','consent_questions','consent_submissions','events','documents','incident_reports','transport_routes',
    'transport_vehicles','drivers','transport_stops','learner_transport_assignments','transport_status_logs',
    'aftercare_sessions','aftercare_pickups','messages','message_threads','audit_logs'
  ]
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

create or replace function public.current_user_school_id()
returns uuid
language sql
stable
security definer
as $$
  select school_id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.has_role(required_role text)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.users u
    join public.user_roles ur on ur.user_id = u.id
    where u.auth_user_id = auth.uid()
      and ur.role = required_role
  );
$$;

create or replace function public.has_any_role(required_roles text[])
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.users u
    join public.user_roles ur on ur.user_id = u.id
    where u.auth_user_id = auth.uid()
      and ur.role = any(required_roles)
  );
$$;

-- Starter school-scope read policy for staff/admin tables.
-- Replace and narrow these policies before production.
do $$
declare
  t text;
begin
  foreach t in array array[
    'users','user_roles','grades','classes','teachers','class_learners','attendance_records','notices',
    'notice_audiences','notifications','consent_forms','consent_questions','consent_submissions','events','documents',
    'messages','message_threads','audit_logs'
  ]
  loop
    execute format(
      'create policy %I on %I for select using (school_id = public.current_user_school_id() and public.has_any_role(array[''SUPER_ADMIN'',''SCHOOL_ADMIN'',''PRINCIPAL'',''TEACHER'']))',
      t || '_staff_select',
      t
    );
  end loop;
end $$;

create policy schools_member_select on schools
for select using (id = public.current_user_school_id());

create policy users_self_select on users
for select using (auth_user_id = auth.uid());

create policy user_roles_self_select on user_roles
for select using (
  school_id = public.current_user_school_id()
  and exists (
    select 1
    from users u
    where u.id = user_roles.user_id
      and u.auth_user_id = auth.uid()
  )
);

create policy learners_parent_select on learners
for select using (
  school_id = public.current_user_school_id()
  and exists (
    select 1
    from learner_parents lp
    join parents p on p.id = lp.parent_id
    join users u on u.id = p.user_id
    where lp.learner_id = learners.id
      and u.auth_user_id = auth.uid()
  )
);

create policy parents_self_select on parents
for select using (
  school_id = public.current_user_school_id()
  and exists (select 1 from users u where u.id = parents.user_id and u.auth_user_id = auth.uid())
);

create policy learner_parents_self_select on learner_parents
for select using (
  school_id = public.current_user_school_id()
  and exists (
    select 1 from parents p join users u on u.id = p.user_id
    where p.id = learner_parents.parent_id and u.auth_user_id = auth.uid()
  )
);

create policy fee_finance_select on fee_accounts
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','FINANCE']));

create policy payments_finance_select on payments
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','FINANCE']));

create policy proof_finance_select on proof_of_payments
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','FINANCE']));

create policy transport_staff_select on transport_routes
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TRANSPORT_MANAGER']));

create policy vehicles_staff_select on transport_vehicles
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TRANSPORT_MANAGER']));

create policy drivers_staff_select on drivers
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TRANSPORT_MANAGER']));

create policy aftercare_staff_select on aftercare_sessions
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','AFTERCARE_STAFF']));

create policy incident_staff_select on incident_reports
for select using (school_id = public.current_user_school_id() and public.has_any_role(array['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER']));

create policy incident_parent_visible_select on incident_reports
for select using (
  school_id = public.current_user_school_id()
  and parent_visible = true
  and exists (
    select 1
    from learner_parents lp
    join parents p on p.id = lp.parent_id
    join users u on u.id = p.user_id
    where lp.learner_id = incident_reports.learner_id
      and u.auth_user_id = auth.uid()
  )
);

-- Broad insert/update placeholders for school admins and principals only.
-- Narrow by module before production.
do $$
declare
  t text;
begin
  foreach t in array array[
    'learners','parents','learner_parents','teachers','grades','classes','class_learners','attendance_records','notices',
    'notice_audiences','notifications','fee_accounts','payments','proof_of_payments','consent_forms','consent_questions',
    'consent_submissions','events','documents','incident_reports','transport_routes','transport_vehicles','drivers',
    'transport_stops','learner_transport_assignments','transport_status_logs','aftercare_sessions','aftercare_pickups',
    'messages','message_threads','audit_logs'
  ]
  loop
    execute format(
      'create policy %I on %I for all using (school_id = public.current_user_school_id() and public.has_any_role(array[''SUPER_ADMIN'',''SCHOOL_ADMIN'',''PRINCIPAL''])) with check (school_id = public.current_user_school_id() and public.has_any_role(array[''SUPER_ADMIN'',''SCHOOL_ADMIN'',''PRINCIPAL'']))',
      t || '_admin_all',
      t
    );
  end loop;
end $$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'schools','users','user_roles','learners','parents','learner_parents','teachers','grades','classes','class_learners',
    'attendance_records','notices','notice_audiences','notifications','fee_accounts','payments','proof_of_payments',
    'consent_forms','consent_questions','consent_submissions','events','documents','incident_reports','transport_routes',
    'transport_vehicles','drivers','transport_stops','learner_transport_assignments','transport_status_logs',
    'aftercare_sessions','aftercare_pickups','messages','message_threads'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on %I', t, t);
    execute format('create trigger set_%I_updated_at before update on %I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

create index if not exists users_school_id_idx on users(school_id);
create index if not exists learners_school_id_idx on learners(school_id);
create index if not exists learners_class_id_idx on learners(class_id);
create index if not exists learner_parents_learner_id_idx on learner_parents(learner_id);
create index if not exists learner_parents_parent_id_idx on learner_parents(parent_id);
create index if not exists attendance_records_date_idx on attendance_records(school_id, attendance_date);
create index if not exists fee_accounts_learner_id_idx on fee_accounts(learner_id);
create index if not exists payments_fee_account_id_idx on payments(fee_account_id);
create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists documents_visibility_idx on documents(school_id, visibility_type, visibility_target_id);
create index if not exists audit_logs_school_created_idx on audit_logs(school_id, created_at desc);
