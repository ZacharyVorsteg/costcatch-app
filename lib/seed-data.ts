export const DEFAULT_CATEGORIES = [
  { name: 'Proteins', sort_order: 1 },
  { name: 'Produce', sort_order: 2 },
  { name: 'Dairy', sort_order: 3 },
  { name: 'Dry Goods', sort_order: 4 },
  { name: 'Beverages', sort_order: 5 },
  { name: 'Frozen', sort_order: 6 },
]

export const DEFAULT_ITEMS = [
  // Proteins
  { name: 'Chicken breast', unit: 'lb', category: 'Proteins', default_price: 3.99 },
  { name: 'Ground beef', unit: 'lb', category: 'Proteins', default_price: 5.49 },
  { name: 'Salmon fillet', unit: 'lb', category: 'Proteins', default_price: 12.99 },
  { name: 'Shrimp', unit: 'lb', category: 'Proteins', default_price: 9.99 },
  { name: 'Pork loin', unit: 'lb', category: 'Proteins', default_price: 4.29 },
  { name: 'Bacon', unit: 'lb', category: 'Proteins', default_price: 7.99 },
  { name: 'Turkey breast', unit: 'lb', category: 'Proteins', default_price: 6.99 },

  // Produce
  { name: 'Lettuce (romaine)', unit: 'case', category: 'Produce', default_price: 24.99 },
  { name: 'Tomatoes', unit: 'lb', category: 'Produce', default_price: 2.49 },
  { name: 'Onions', unit: 'lb', category: 'Produce', default_price: 1.29 },
  { name: 'Potatoes', unit: 'lb', category: 'Produce', default_price: 0.89 },
  { name: 'Avocados', unit: 'each', category: 'Produce', default_price: 1.49 },
  { name: 'Bell peppers', unit: 'lb', category: 'Produce', default_price: 3.29 },
  { name: 'Carrots', unit: 'lb', category: 'Produce', default_price: 1.49 },
  { name: 'Lemons', unit: 'each', category: 'Produce', default_price: 0.49 },
  { name: 'Garlic', unit: 'lb', category: 'Produce', default_price: 4.99 },

  // Dairy
  { name: 'Milk', unit: 'gal', category: 'Dairy', default_price: 4.29 },
  { name: 'Heavy cream', unit: 'qt', category: 'Dairy', default_price: 5.49 },
  { name: 'Butter', unit: 'lb', category: 'Dairy', default_price: 4.99 },
  { name: 'Cheese, cheddar', unit: 'lb', category: 'Dairy', default_price: 6.49 },
  { name: 'Eggs', unit: 'case', category: 'Dairy', default_price: 45.00 },
  { name: 'Sour cream', unit: 'lb', category: 'Dairy', default_price: 2.99 },
  { name: 'Parmesan', unit: 'lb', category: 'Dairy', default_price: 12.99 },

  // Dry Goods
  { name: 'Rice', unit: 'lb', category: 'Dry Goods', default_price: 1.49 },
  { name: 'Pasta', unit: 'lb', category: 'Dry Goods', default_price: 1.99 },
  { name: 'Flour', unit: 'lb', category: 'Dry Goods', default_price: 0.69 },
  { name: 'Oil, vegetable', unit: 'gal', category: 'Dry Goods', default_price: 8.99 },
  { name: 'Sugar', unit: 'lb', category: 'Dry Goods', default_price: 0.79 },
  { name: 'Olive oil', unit: 'gal', category: 'Dry Goods', default_price: 28.99 },
  { name: 'Bread crumbs', unit: 'lb', category: 'Dry Goods', default_price: 2.49 },

  // Beverages
  { name: 'Coffee beans', unit: 'lb', category: 'Beverages', default_price: 12.99 },
  { name: 'Tea bags', unit: 'box', category: 'Beverages', default_price: 8.99 },
  { name: 'Orange juice', unit: 'gal', category: 'Beverages', default_price: 6.99 },

  // Frozen
  { name: 'French fries', unit: 'case', category: 'Frozen', default_price: 32.99 },
  { name: 'Ice cream', unit: 'gal', category: 'Frozen', default_price: 14.99 },
]

export const WASTE_REASONS = [
  { value: 'spoilage', label: 'Spoilage', description: 'Product expired or went bad' },
  { value: 'overproduction', label: 'Overproduction', description: 'Made too much, couldn\'t sell' },
  { value: 'mistake', label: 'Prep Mistake', description: 'Error during preparation' },
  { value: 'customer_return', label: 'Customer Return', description: 'Sent back by customer' },
]

export const RESTAURANT_TYPES = [
  'Fast Food',
  'Fast Casual',
  'Casual Dining',
  'Fine Dining',
  'Cafe/Coffee Shop',
  'Bar/Pub',
  'Food Truck',
  'Catering',
  'Ghost Kitchen',
  'Other',
]

export const UNIT_OPTIONS = [
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'gal', label: 'Gallons (gal)' },
  { value: 'qt', label: 'Quarts (qt)' },
  { value: 'pt', label: 'Pints (pt)' },
  { value: 'l', label: 'Liters (L)' },
  { value: 'ml', label: 'Milliliters (mL)' },
  { value: 'each', label: 'Each' },
  { value: 'case', label: 'Case' },
  { value: 'box', label: 'Box' },
  { value: 'bag', label: 'Bag' },
  { value: 'bunch', label: 'Bunch' },
]
