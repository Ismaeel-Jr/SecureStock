export type Role = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category_id: string;
  supplier_id: string;
  unit_price: number;
  stock_quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  supplier?: Supplier;
}

export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string | null;
  created_at: string;
  user_id: string;
  product?: Product;
}
