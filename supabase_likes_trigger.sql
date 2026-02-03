-- 1. Hàm cập nhật số lượng like
create or replace function public.handle_new_like()
returns trigger as $$
begin
  update public.posts
  set likes_count = likes_count + 1
  where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_remove_like()
returns trigger as $$
begin
  update public.posts
  set likes_count = likes_count - 1
  where id = old.post_id;
  return old;
end;
$$ language plpgsql security definer;

-- 2. Gắn Trigger vào bảng Likes
create trigger on_like_added
  after insert on public.likes
  for each row execute procedure public.handle_new_like();

create trigger on_like_removed
  after delete on public.likes
  for each row execute procedure public.handle_remove_like();
