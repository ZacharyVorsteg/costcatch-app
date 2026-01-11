export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  type: string | null;
  target_food_cost_pct: number;
  monthly_food_spend: number | null;
  stripe_customer_id: string | null;
  subscription_status: 'trial' | 'active' | 'canceled' | 'past_due';
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface InventoryItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  unit: string;
  current_price: number | null;
  par_level: number | null;
  vendor_id: string | null;
  is_active: boolean;
  created_at: string;
  category?: Category;
  vendor?: Vendor;
}

export interface InventoryCount {
  id: string;
  restaurant_id: string;
  counted_by: string;
  count_date: string;
  total_value: number | null;
  created_at: string;
  items?: CountItem[];
}

export interface CountItem {
  id: string;
  count_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  item?: InventoryItem;
}

export interface WasteLog {
  id: string;
  restaurant_id: string;
  item_id: string;
  quantity: number;
  unit_price: number | null;
  total_value: number | null;
  reason: 'spoilage' | 'overproduction' | 'mistake' | 'customer_return';
  notes: string | null;
  logged_by: string;
  logged_at: string;
  item?: InventoryItem;
}

export interface Vendor {
  id: string;
  restaurant_id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  item_id: string;
  vendor_id: string;
  price: number;
  effective_date: string;
  created_at: string;
}

export interface DailyFoodCost {
  restaurant_id: string;
  count_date: string;
  inventory_value: number;
  prev_value: number | null;
  usage: number | null;
}

export interface Alert {
  id: string;
  type: 'price_spike' | 'low_stock' | 'high_waste' | 'food_cost';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  item_id?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  restaurant_id: string;
  role: 'owner' | 'manager' | 'staff';
  email: string;
  name: string | null;
  created_at: string;
}

export type SubscriptionPlan = 'starter' | 'growth';

export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limits: {
    items: number;
    users: number;
    historyDays: number;
  };
}
