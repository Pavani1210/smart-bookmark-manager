-- Create the bookmarks table
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view own bookmarks" 
  on bookmarks for select 
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks" 
  on bookmarks for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks" 
  on bookmarks for update 
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks" 
  on bookmarks for delete 
  using (auth.uid() = user_id);

-- Enable Realtime
-- Note: You might need to enable replication for this table in the Supabase Dashboard
-- under Database > Replication if this command doesn't work directly due to permissions.
alter publication supabase_realtime add table bookmarks;
