-- 1. RESET (Xóa bảng cũ để tạo lại cho sạch)
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
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

-- 10. TẠO BẢNG JOBS (Tin tuyển dụng)
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  recruiter_id uuid references public.profiles(id) not null,
  title text not null, -- Vị trí: VD: Sales Sup, Giao hàng
  company_name text, -- Tên công ty/NPP (nếu khác tên profile)
  location text not null, -- Khu vực: VD: Cầu Giấy, Hà Nội
  salary_range text, -- VD: 10 - 15 triệu
  description text,
  requirements text, -- Yêu cầu
  benefits text, -- Quyền lợi
  category text, -- VD: Sales, Kho, Kế toán
  status text default 'active' check (status in ('active', 'closed')),
  created_at timestamp with time zone default now()
);

-- Bảo mật cho JOBS
alter table public.jobs enable row level security;
create policy "Anyone can view active jobs" on jobs for select using ( status = 'active' );
create policy "Recruiters can insert jobs" on jobs for insert with check ( auth.uid() = recruiter_id );
create policy "Recruiters can update own jobs" on jobs for update using ( auth.uid() = recruiter_id );

-- 11. TẠO BẢNG JOB_APPLICATIONS (Ứng tuyển)
create table public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) not null,
  applicant_id uuid references public.profiles(id) not null,
  cover_letter text, -- Lời nhắn ngắn gọn
  status text default 'pending' check (status in ('pending', 'reviewed', 'contacted', 'rejected')),
  created_at timestamp with time zone default now(),
  unique(job_id, applicant_id) -- Mỗi người chỉ ứng tuyển 1 lần/job
);

-- Bảo mật cho APPLICATIONS
alter table public.job_applications enable row level security;
create policy "Recruiters can view applications for their jobs" 
  on job_applications for select 
  using ( exists (select 1 from jobs where jobs.id = job_applications.job_id and jobs.recruiter_id = auth.uid()) );

create policy "Applicants can view own applications"
  on job_applications for select
  using ( auth.uid() = applicant_id );

create policy "Users can apply"
  on job_applications for insert
  with check ( auth.uid() = applicant_id );

-- 12. Add to Realtime (Optional, maybe for recruiters)
alter publication supabase_realtime add table public.job_applications;

-- 13. REFERRAL SYSTEM (Phase 2)
-- Thêm cột mã giới thiệu và người giới thiệu vào bảng profiles
alter table public.profiles 
add column if not exists referral_code text unique,
add column if not exists referrer_id uuid references public.profiles(id);

-- Hàm để tạo mã giới thiệu ngẫu nhiên (dùng cho user mới)
create or replace function generate_referral_code()
returns trigger as $$
begin
  -- Tạo mã random 8 ký tự (VD: A1B2C3D4)
  new.referral_code := upper(substring(md5(random()::text) from 1 for 8));
  return new;
end;
$$ language plpgsql;

-- Trigger tự động tạo mã khi insert profile mới (nếu chưa có)
-- create trigger on_auth_user_created_referral
--   before insert on public.profiles
--   for each row execute procedure generate_referral_code();
-- (Note: Ta sẽ xử lý logic tạo mã ở server side hoặc trigger tùy chọn, 
-- để đơn giản ta có thể update thủ công hoặc qua API khi user bấm "Tạo mã")
