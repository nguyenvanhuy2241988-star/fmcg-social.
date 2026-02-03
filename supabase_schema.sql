-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('candidate', 'recruiter')),
  headline text,
  company_name text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for posts (The Feed)
create table posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references profiles(id) not null,
  content text,
  image_url text,
  likes_count int default 0
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone."
  on posts for select
  using ( true );

create policy "Authenticated users can create posts."
  on posts for insert
  with check ( auth.role() = 'authenticated' );

-- Create a table for likes
create table likes (
  user_id uuid references profiles(id) not null,
  post_id uuid references posts(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

alter table likes enable row level security;

create policy "Authenticated users can like posts"
  on likes for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can unlike posts"
  on likes for delete
  using ( auth.uid() = user_id );
