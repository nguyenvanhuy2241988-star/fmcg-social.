-- Tạo bảng Connections (Kết nối)
create table if not exists public.connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default now(),
  unique(requester_id, receiver_id)
);

-- Bật RLS
alter table public.connections enable row level security;

-- Policy
create policy "Users can see their own connections"
  on public.connections for select
  using ( auth.uid() = requester_id or auth.uid() = receiver_id );

create policy "Users can request connection"
  on public.connections for insert
  with check ( auth.uid() = requester_id );

create policy "Users can update status (accept)"
  on public.connections for update
  using ( auth.uid() = receiver_id );

-- Index cho nhanh
create index if not exists idx_connections_users on public.connections(requester_id, receiver_id);
