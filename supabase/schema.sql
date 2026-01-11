-- CostCatch Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Custom types
create type subscription_status as enum ('trial', 'active', 'canceled', 'past_due');
create type waste_reason as enum ('spoilage', 'overproduction', 'mistake', 'customer_return');
create type team_role as enum ('owner', 'manager', 'staff');

-- Restaurants table (main account)
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text,
  target_food_cost_pct numeric default 30,
  monthly_food_spend numeric,
  stripe_customer_id text,
  subscription_status subscription_status default 'trial',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  name text not null,
  sort_order integer default 0
);

-- Vendors table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  name text not null,
  contact_name text,
  phone text,
  email text,
  created_at timestamp with time zone default now()
);

-- Inventory items table
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  unit text not null,
  current_price numeric,
  par_level numeric,
  vendor_id uuid references vendors(id) on delete set null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Inventory counts table
create table if not exists inventory_counts (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  counted_by text not null,
  count_date date not null default current_date,
  total_value numeric,
  created_at timestamp with time zone default now()
);

-- Count items table
create table if not exists count_items (
  id uuid primary key default gen_random_uuid(),
  count_id uuid references inventory_counts(id) on delete cascade not null,
  item_id uuid references inventory_items(id) on delete cascade not null,
  quantity numeric not null,
  unit_price numeric not null,
  total_value numeric not null
);

-- Waste logs table
create table if not exists waste_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  item_id uuid references inventory_items(id) on delete cascade not null,
  quantity numeric not null,
  unit_price numeric,
  total_value numeric,
  reason waste_reason not null,
  notes text,
  logged_by text not null,
  logged_at timestamp with time zone default now()
);

-- Price history table
create table if not exists price_history (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references inventory_items(id) on delete cascade not null,
  vendor_id uuid references vendors(id) on delete set null,
  price numeric not null,
  effective_date date not null default current_date,
  created_at timestamp with time zone default now()
);

-- Team members table
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  role team_role not null default 'staff',
  email text not null,
  name text,
  created_at timestamp with time zone default now()
);

-- Create indexes
create index if not exists idx_restaurants_user_id on restaurants(user_id);
create index if not exists idx_categories_restaurant_id on categories(restaurant_id);
create index if not exists idx_vendors_restaurant_id on vendors(restaurant_id);
create index if not exists idx_inventory_items_restaurant_id on inventory_items(restaurant_id);
create index if not exists idx_inventory_items_category_id on inventory_items(category_id);
create index if not exists idx_inventory_counts_restaurant_id on inventory_counts(restaurant_id);
create index if not exists idx_inventory_counts_date on inventory_counts(count_date);
create index if not exists idx_count_items_count_id on count_items(count_id);
create index if not exists idx_waste_logs_restaurant_id on waste_logs(restaurant_id);
create index if not exists idx_waste_logs_logged_at on waste_logs(logged_at);
create index if not exists idx_price_history_item_id on price_history(item_id);
create index if not exists idx_team_members_restaurant_id on team_members(restaurant_id);

-- Enable RLS
alter table restaurants enable row level security;
alter table categories enable row level security;
alter table vendors enable row level security;
alter table inventory_items enable row level security;
alter table inventory_counts enable row level security;
alter table count_items enable row level security;
alter table waste_logs enable row level security;
alter table price_history enable row level security;
alter table team_members enable row level security;

-- RLS Policies for restaurants
create policy "Users can view own restaurants" on restaurants
  for select using (auth.uid() = user_id);

create policy "Users can manage own restaurants" on restaurants
  for all using (auth.uid() = user_id);

-- RLS Policies for categories
create policy "Users can view categories in their restaurant" on categories
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can manage categories in their restaurant" on categories
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- RLS Policies for vendors
create policy "Users can view vendors in their restaurant" on vendors
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can manage vendors in their restaurant" on vendors
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- RLS Policies for inventory_items
create policy "Users can view items in their restaurant" on inventory_items
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can manage items in their restaurant" on inventory_items
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- RLS Policies for inventory_counts
create policy "Users can view counts in their restaurant" on inventory_counts
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can manage counts in their restaurant" on inventory_counts
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- RLS Policies for count_items
create policy "Users can view count items in their restaurant" on count_items
  for select using (
    count_id in (
      select id from inventory_counts where restaurant_id in (
        select id from restaurants where user_id = auth.uid()
      )
    )
  );

create policy "Users can manage count items in their restaurant" on count_items
  for all using (
    count_id in (
      select id from inventory_counts where restaurant_id in (
        select id from restaurants where user_id = auth.uid()
      )
    )
  );

-- RLS Policies for waste_logs
create policy "Users can view waste logs in their restaurant" on waste_logs
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can manage waste logs in their restaurant" on waste_logs
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- RLS Policies for price_history
create policy "Users can view price history in their restaurant" on price_history
  for select using (
    item_id in (
      select id from inventory_items where restaurant_id in (
        select id from restaurants where user_id = auth.uid()
      )
    )
  );

create policy "Users can manage price history in their restaurant" on price_history
  for all using (
    item_id in (
      select id from inventory_items where restaurant_id in (
        select id from restaurants where user_id = auth.uid()
      )
    )
  );

-- RLS Policies for team_members
create policy "Users can view team in their restaurant" on team_members
  for select using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "Users can manage team in their restaurant" on team_members
  for all using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- Function to update timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger update_restaurants_updated_at
  before update on restaurants
  for each row execute function update_updated_at();
