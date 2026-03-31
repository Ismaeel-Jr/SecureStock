-- SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. Create Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Suppliers table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  unit_price DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  min_stock_level INTEGER DEFAULT 5 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Stock Movements table
CREATE TABLE stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  type TEXT CHECK (type IN ('in', 'out')) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- 7. Create Policies

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: Everyone can read, only admins can modify
CREATE POLICY "Categories are viewable by everyone." ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify categories." ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Suppliers: Everyone can read, only admins can modify
CREATE POLICY "Suppliers are viewable by everyone." ON suppliers
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify suppliers." ON suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products: Everyone can read, only admins can modify
CREATE POLICY "Products are viewable by everyone." ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify products." ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Stock Movements: Everyone can read, only authenticated users can insert
CREATE POLICY "Stock movements are viewable by everyone." ON stock_movements
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert stock movements." ON stock_movements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8. Seed some initial data (Optional)
INSERT INTO categories (name, description) VALUES 
('Produce', 'Fresh fruits and vegetables'),
('Dairy', 'Milk, cheese, and eggs'),
('Bakery', 'Freshly baked bread and pastries'),
('Meat', 'Fresh meat and poultry'),
('Pantry', 'Dry goods and canned items');

INSERT INTO suppliers (name, contact_name, email, phone, address) VALUES 
('Fresh Farms Co.', 'Sarah Jenkins', 'contact@freshfarms.com', '555-0101', '123 Farm Road, Green Valley'),
('Dairy Delights', 'Mike Miller', 'sales@dairydelights.com', '555-0102', '456 Pasture Lane, Milkville'),
('Global Grains', 'David Grain', 'info@globalgrains.com', '555-0103', '789 Silo Street, Wheatland');
