-- CostCatch Database Schema
-- Restaurant Food Cost Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT,
  target_food_cost_pct DECIMAL DEFAULT 30,
  monthly_food_spend DECIMAL,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  current_price DECIMAL,
  par_level DECIMAL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory counts table (header)
CREATE TABLE inventory_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  counted_by UUID REFERENCES auth.users,
  count_date DATE NOT NULL,
  total_value DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Count items table (detail)
CREATE TABLE count_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count_id UUID REFERENCES inventory_counts(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL NOT NULL,
  unit_price DECIMAL NOT NULL,
  total_value DECIMAL NOT NULL
);

-- Waste logs table
CREATE TABLE waste_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL NOT NULL,
  unit_price DECIMAL,
  total_value DECIMAL,
  reason TEXT CHECK (reason IN ('spoilage', 'overproduction', 'mistake', 'customer_return')),
  notes TEXT,
  logged_by UUID REFERENCES auth.users,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  price DECIMAL NOT NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- Indexes for performance
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_inventory_items_restaurant_id ON inventory_items(restaurant_id);
CREATE INDEX idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX idx_inventory_counts_restaurant_id ON inventory_counts(restaurant_id);
CREATE INDEX idx_inventory_counts_count_date ON inventory_counts(count_date);
CREATE INDEX idx_count_items_count_id ON count_items(count_id);
CREATE INDEX idx_waste_logs_restaurant_id ON waste_logs(restaurant_id);
CREATE INDEX idx_waste_logs_logged_at ON waste_logs(logged_at);
CREATE INDEX idx_vendors_restaurant_id ON vendors(restaurant_id);
CREATE INDEX idx_price_history_item_id ON price_history(item_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE count_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Users can view own restaurants" ON restaurants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own restaurants" ON restaurants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own restaurants" ON restaurants
  FOR UPDATE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Users can view categories for their restaurants" ON categories
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage categories for their restaurants" ON categories
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- Vendors policies
CREATE POLICY "Users can view vendors for their restaurants" ON vendors
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage vendors for their restaurants" ON vendors
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- Inventory items policies
CREATE POLICY "Users can view items for their restaurants" ON inventory_items
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage items for their restaurants" ON inventory_items
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- Inventory counts policies
CREATE POLICY "Users can view counts for their restaurants" ON inventory_counts
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage counts for their restaurants" ON inventory_counts
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- Count items policies
CREATE POLICY "Users can view count items" ON count_items
  FOR SELECT USING (
    count_id IN (
      SELECT id FROM inventory_counts WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage count items" ON count_items
  FOR ALL USING (
    count_id IN (
      SELECT id FROM inventory_counts WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

-- Waste logs policies
CREATE POLICY "Users can view waste logs for their restaurants" ON waste_logs
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage waste logs for their restaurants" ON waste_logs
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- Price history policies
CREATE POLICY "Users can view price history" ON price_history
  FOR SELECT USING (
    item_id IN (
      SELECT id FROM inventory_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage price history" ON price_history
  FOR ALL USING (
    item_id IN (
      SELECT id FROM inventory_items WHERE restaurant_id IN (
        SELECT id FROM restaurants WHERE user_id = auth.uid()
      )
    )
  );

-- Team members policies
CREATE POLICY "Users can view team members" ON team_members
  FOR SELECT USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
    OR user_id = auth.uid()
  );

CREATE POLICY "Restaurant owners can manage team members" ON team_members
  FOR ALL USING (
    restaurant_id IN (SELECT id FROM restaurants WHERE user_id = auth.uid())
  );

-- View for daily food cost calculation
CREATE OR REPLACE VIEW daily_food_cost AS
SELECT
  c.restaurant_id,
  c.count_date,
  c.total_value AS inventory_value,
  LAG(c.total_value) OVER (PARTITION BY c.restaurant_id ORDER BY c.count_date) AS prev_value,
  c.total_value - LAG(c.total_value) OVER (PARTITION BY c.restaurant_id ORDER BY c.count_date) AS usage
FROM inventory_counts c;

-- Function to update item prices and track history
CREATE OR REPLACE FUNCTION update_item_price()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.current_price IS DISTINCT FROM NEW.current_price THEN
    INSERT INTO price_history (item_id, vendor_id, price, effective_date)
    VALUES (NEW.id, NEW.vendor_id, NEW.current_price, CURRENT_DATE);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_price_changes
  AFTER UPDATE OF current_price ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_item_price();
