-- Add Talent Card fields to Profiles table
alter table public.profiles
add column if not exists zone text,
add column if not exists categories text[], -- Array of text
add column if not exists phone text,
add column if not exists availability_status text default 'open_to_work',
add constraint check_availability check (availability_status in ('open_to_work', 'hiring', 'busy'));

-- Create index for faster filtering
create index if not exists idx_profiles_zone on public.profiles(zone);
