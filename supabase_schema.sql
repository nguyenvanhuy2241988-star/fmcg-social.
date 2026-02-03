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

-- 6. TẠO BẢNG COMMENTS (Bình luận)
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default now()
);

-- Bật bảo mật cho Comments
alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on comments for select
  using ( true );

create policy "Authenticated users can comment"
  on comments for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can delete own comments"
  on comments for delete
  using ( auth.uid() = user_id );

-- 7. BẬT REALTIME (Để chat và hiện thông báo)
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
-- 8. TẠO BẢNG NOTIFICATIONS (Thông báo)
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  receiver_id uuid references public.profiles(id) not null,
  actor_id uuid references public.profiles(id) not null, -- Người gây ra thông báo
  type text check (type in ('like', 'comment', 'connection_request', 'connection_accepted')),
  entity_id uuid, -- ID của post hoặc connection
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Bật bảo mật
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select
  using ( auth.uid() = receiver_id );

create policy "System can insert notifications"
  on notifications for insert
  with check ( true ); -- Cho phép tạo thoải mái từ trigger hoặc API

-- 9. BẬT REALTIME
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.likes;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.notifications;
