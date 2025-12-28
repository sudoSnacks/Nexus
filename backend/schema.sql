-- Create Events Table
create table events (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date timestamp with time zone not null,
  location text not null,
  capacity int,
  requires_approval boolean default false,
  created_at timestamp with time zone default now()
);

-- Create Attendees Table
create table attendees (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  checked_in boolean default false,
  email_sent boolean default false,
  status text default 'confirmed', -- 'confirmed', 'pending', 'rejected'
  event_id uuid references events(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Create Profiles Table (for Roles)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('admin', 'helper', 'user')),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table events enable row level security;
alter table attendees enable row level security;
alter table profiles enable row level security;

-- Policies for Events (Admin only for full access, Public read optional)
create policy "Public can view events" on events for select using (true);
create policy "Admins can manage events" on events for all using (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Policies for Attendees
create policy "Public can create attendees" on attendees for insert with check (true);
create policy "Public can view own ticket" on attendees for select using (true);
create policy "Admins and Helpers can view all attendees" on attendees for select using (
  exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'helper')
  )
);
create policy "Admins and Helpers can update attendees" on attendees for update using (
  exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'helper')
  )
);

-- Policies for Profiles
create policy "Public can view profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can update users roles" on profiles for update using (
  exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
