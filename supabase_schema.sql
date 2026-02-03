-- 1. RESET (Xóa bảng cũ để tạo lại cho sạch)
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. TẠO BẢNG PROFILES (Người dùng)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('candidate', 'recruiter')),
  full_name text,
  avatar_url text,
  company_name text,
  headline text,
  updated_at timestamp with time zone
);

-- Bật bảo mật (RLS) cho Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 3. TẠO BẢNG POSTS (Bài đăng)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  content text,
  image_url text,
  author_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default now(),
  likes_count int default 0,
  comments_count int default 0
);

-- Bật bảo mật cho Posts
alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on posts for select
  using ( true );

create policy "Authenticated users can create posts"
  on posts for insert
  with check ( auth.role() = 'authenticated' );

-- 4. TẠO BẢNG LIKES (Lượt thích)
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  post_id uuid references public.posts(id) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- Bật bảo mật cho Likes
alter table public.likes enable row level security;

create policy "Likes are viewable by everyone"
  on likes for select
  using ( true );

create policy "Authenticated users can like posts"
  on likes for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can unlike posts"
  on likes for delete
  using ( auth.uid() = user_id );

-- 5. BẬT REALTIME (Để chat và hiện thông báo)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.likes;
