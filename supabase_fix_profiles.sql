-- 1. Hàm tự động tạo Profile khi User đăng ký
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    'candidate'
  )
  on conflict (id) do nothing; -- Tránh lỗi trùng lặp
  return new;
end;
$$ language plpgsql security definer;

-- 2. Gắn Trigger vào bảng auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. QUAN TRỌNG: Cập nhật lại (Backfill) cho các User cũ chưa có Profile
insert into public.profiles (id, email, full_name, avatar_url, role)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name', 
  raw_user_meta_data->>'avatar_url', 
  'candidate'
from auth.users
on conflict (id) do nothing;
