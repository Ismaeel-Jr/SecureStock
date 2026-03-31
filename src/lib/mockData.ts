import { Product, Category, Supplier, Profile } from '../types';

export const MOCK_PROFILE: Profile = {
  id: 'user-123',
  email: 'admin@securestock.com',
  full_name: 'Admin User',
  role: 'admin',
  created_at: new Date().toISOString(),
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Produce', description: 'Fresh fruits and vegetables' },
  { id: 'cat-2', name: 'Dairy', description: 'Milk, cheese, and eggs' },
  { id: 'cat-3', name: 'Bakery', description: 'Freshly baked bread and pastries' },
  { id: 'cat-4', name: 'Meat', description: 'Fresh meat and poultry' },
  { id: 'cat-5', name: 'Pantry', description: 'Dry goods and canned items' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { 
    id: 'sup-1', 
    name: 'Fresh Farms Co.', 
    contact_name: 'Sarah Jenkins', 
    email: 'contact@freshfarms.com', 
    phone: '555-0101', 
    address: '123 Farm Road, Green Valley' 
  },
  { 
    id: 'sup-2', 
    name: 'Dairy Delights', 
    contact_name: 'Mike Miller', 
    email: 'sales@dairydelights.com', 
    phone: '555-0102', 
    address: '456 Pasture Lane, Milkville' 
  },
  { 
    id: 'sup-3', 
    name: 'Global Grains', 
    contact_name: 'David Grain', 
    email: 'info@globalgrains.com', 
    phone: '555-0103', 
    address: '789 Silo Street, Wheatland' 
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Organic Bananas',
    sku: 'BAN-001',
    description: 'Fresh organic bananas from Ecuador',
    category_id: 'cat-1',
    supplier_id: 'sup-1',
    unit_price: 0.99,
    stock_quantity: 150,
    min_stock_level: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[0],
    supplier: MOCK_SUPPLIERS[0],
  },
  {
    id: 'prod-2',
    name: 'Whole Milk 1L',
    sku: 'MILK-001',
    description: 'Fresh whole milk, pasteurized',
    category_id: 'cat-2',
    supplier_id: 'sup-2',
    unit_price: 1.50,
    stock_quantity: 12,
    min_stock_level: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[1],
    supplier: MOCK_SUPPLIERS[1],
  },
  {
    id: 'prod-3',
    name: 'Sourdough Bread',
    sku: 'BAKE-001',
    description: 'Artisan sourdough loaf',
    category_id: 'cat-3',
    supplier_id: 'sup-3',
    unit_price: 4.50,
    stock_quantity: 45,
    min_stock_level: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: MOCK_CATEGORIES[2],
    supplier: MOCK_SUPPLIERS[2],
  },
];
