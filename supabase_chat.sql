-- TẠO BẢNG MESSAGES (Tin nhắn)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Bật bảo mật (RLS)
alter table public.messages enable row level security;

-- Chính sách: Chỉ người gửi hoặc người nhận mới xem được tin nhắn
create policy "Users can view their own messages"
  on messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

-- Chính sách: Chỉ được gửi tin nhắn với tư cách chính mình
create policy "Users can insert their own messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

-- BẬT REALTIME CHO MESSAGES
alter publication supabase_realtime add table public.messages;
