-- 1. Create the profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create Policy: Everyone can view profiles (needed for checking roles)
-- You can make this stricter if you only want admins to see others' roles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 4. Create a Trigger to auto-create profile on signup
-- This function runs every time a new user is added to auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. BACKFILL: Fix existing users who don't have a profile
insert into public.profiles (id, email, role)
select id, email, 'user'
from auth.users
on conflict (id) do nothing;

-- 6. (OPTIONAL) Make yourself an admin
-- Uncomment and run this line with your email after running the above
-- update public.profiles set role = 'admin' where email = 'your_email@example.com';
