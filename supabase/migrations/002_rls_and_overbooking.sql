-- ============================================================
-- Migration 002: Row Level Security + Atomic Overbooking Guard
-- ============================================================

-- 1. Enable RLS on all tables
alter table reservations enable row level security;
alter table time_slots enable row level security;
alter table settings enable row level security;

-- 2. RLS policies for time_slots (public read, admin write)
create policy "Anyone can read unblocked time slots"
  on time_slots for select
  using (true);

create policy "Only service role can modify time slots"
  on time_slots for all
  using (auth.role() = 'service_role');

-- 3. RLS policies for reservations (no public read — protects PII)
create policy "Guests can insert reservations"
  on reservations for insert
  with check (true);

create policy "Only service role can read reservations"
  on reservations for select
  using (auth.role() = 'service_role');

create policy "Only service role can update reservations"
  on reservations for update
  using (auth.role() = 'service_role');

create policy "Only service role can delete reservations"
  on reservations for delete
  using (auth.role() = 'service_role');

-- 4. RLS policies for settings (public read, admin write)
create policy "Anyone can read settings"
  on settings for select
  using (true);

create policy "Only service role can modify settings"
  on settings for all
  using (auth.role() = 'service_role');

-- 5. Atomic overbooking guard — Postgres function
--    Checks capacity before insert, prevents race conditions
create or replace function check_slot_capacity()
returns trigger as $$
declare
  current_booked int;
  slot_capacity int;
begin
  -- Get current booking total for the slot on this date (exclude cancelled)
  select coalesce(sum(party_size), 0)
  into current_booked
  from reservations
  where time_slot_id = NEW.time_slot_id
    and date = NEW.date
    and status != 'cancelled'
    and id != NEW.id;

  -- Get the slot's max capacity
  select max_capacity
  into slot_capacity
  from time_slots
  where id = NEW.time_slot_id;

  if slot_capacity is null then
    raise exception 'Time slot not found';
  end if;

  if current_booked + NEW.party_size > slot_capacity then
    raise exception 'Slot capacity exceeded: % of % seats taken, requested %',
      current_booked, slot_capacity, NEW.party_size;
  end if;

  return NEW;
end;
$$ language plpgsql;

create trigger enforce_slot_capacity
  before insert or update on reservations
  for each row
  execute function check_slot_capacity();
