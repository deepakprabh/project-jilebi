-- ============================================================
-- Migration 004: Reservation security hardening
-- ============================================================

-- Public reservation writes go through the Next.js API, which validates,
-- rate-limits, and uses the service role. Do not allow direct anon inserts
-- through the Supabase REST API.
drop policy if exists "Guests can insert reservations" on reservations;

-- Replace the capacity trigger with one that serializes checks per slot/date
-- and rejects blocked or day-mismatched slots at the database boundary.
create or replace function check_slot_capacity()
returns trigger as $$
declare
  current_booked int;
  slot_capacity int;
  slot_blocked boolean;
  slot_day smallint;
begin
  perform pg_advisory_xact_lock(hashtextextended(NEW.time_slot_id::text || ':' || NEW.date::text, 0));

  select max_capacity, is_blocked, day_of_week
  into slot_capacity, slot_blocked, slot_day
  from time_slots
  where id = NEW.time_slot_id;

  if slot_capacity is null then
    raise exception 'Time slot not found';
  end if;

  if slot_blocked then
    raise exception 'Time slot is blocked';
  end if;

  if slot_day != extract(dow from NEW.date)::smallint then
    raise exception 'Time slot does not match reservation date';
  end if;

  select coalesce(sum(party_size), 0)
  into current_booked
  from reservations
  where time_slot_id = NEW.time_slot_id
    and date = NEW.date
    and status != 'cancelled'
    and id != NEW.id;

  if current_booked + NEW.party_size > slot_capacity then
    raise exception 'Slot capacity exceeded: % of % seats taken, requested %',
      current_booked, slot_capacity, NEW.party_size;
  end if;

  return NEW;
end;
$$ language plpgsql;
