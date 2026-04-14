create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists guest_sessions (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  reconnect_token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists question_packs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  title text not null,
  description text not null default '',
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists question_pack_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references question_packs(id) on delete cascade,
  prompt_text text not null,
  sort_order integer not null default 1
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  public_room_code text unique not null,
  host_profile_id uuid,
  host_guest_session_id uuid,
  selected_mode text not null default 'mvp-party',
  selected_pack_id uuid,
  status text not null default 'lobby',
  settings_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  profile_id uuid,
  guest_session_id uuid,
  display_name_snapshot text not null,
  is_host boolean not null default false,
  joined_at timestamptz not null default now(),
  left_at timestamptz
);

create table if not exists game_sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  mode_id text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  summary_json jsonb not null default '{}'::jsonb
);

create table if not exists game_rounds (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references game_sessions(id) on delete cascade,
  round_number integer not null,
  prompt_text_snapshot text not null,
  reveal_style text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists round_submissions (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references game_rounds(id) on delete cascade,
  room_member_id uuid not null references room_members(id) on delete cascade,
  answer_text text not null,
  submitted_at timestamptz not null default now()
);

create table if not exists round_votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references game_rounds(id) on delete cascade,
  voter_member_id uuid not null references room_members(id) on delete cascade,
  target_submission_id uuid not null references round_submissions(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists score_entries (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references game_sessions(id) on delete cascade,
  round_id uuid references game_rounds(id) on delete cascade,
  room_member_id uuid not null references room_members(id) on delete cascade,
  points_delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists moderation_actions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  actor_member_id uuid references room_members(id) on delete set null,
  target_member_id uuid references room_members(id) on delete set null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

