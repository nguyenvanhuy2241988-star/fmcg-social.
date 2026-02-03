-- 1. TẠO STORAGE BUCKET (Để lưu ảnh)
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- 2. BẬT BẢO MẬT CHO STORAGE
-- Cho phép ai cũng xem được ảnh (Public)
create policy "Mọi người đều có thể xem ảnh"
  on storage.objects for select
  using ( bucket_id = 'post-images' );

-- Chỉ người đã đăng nhập mới được upload ảnh
create policy "Người dùng đăng nhập được upload"
  on storage.objects for insert
  with check ( bucket_id = 'post-images' and auth.role() = 'authenticated' );
