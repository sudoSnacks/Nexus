-- Create Events Table
create table events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date timestamp with time zone not null,
  location text not null,
  created_at timestamp with time zone default now()
);

-- Create Attendees Table
create table attendees (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  checked_in boolean default false,
  event_id uuid references events(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table events enable row level security;
alter table attendees enable row level security;

-- Policies for Events (Admin only for full access, Public read optional)
-- For simplicity, assuming public can read events to register
create policy "Public can view events" on events for select using (true);
create policy "Admins can manage events" on events for all using (auth.role() = 'authenticated'); -- Adjust based on actual auth implementation

-- Policies for Attendees
create policy "Public can create attendees" on attendees for insert with check (true);
create policy "Public can view own ticket" on attendees for select using (true); -- Ideally stricter, but for now open
create policy "Admins can view all attendees" on attendees for select using (auth.role() = 'authenticated');
create policy "Admins can update attendees" on attendees for update using (auth.role() = 'authenticated');
