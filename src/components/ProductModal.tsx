import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Product, Category, Supplier } from '../types';
import { toast } from 'sonner';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
  categories: Category[];
  suppliers: Supplier[];
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  product, 
  categories, 
  suppliers 
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    supplier_id: '',
    unit_price: 0,
    stock_quantity: 0,
    min_stock_level: 5,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        unit_price: product.unit_price,
        stock_quantity: product.stock_quantity,
        min_stock_level: product.min_stock_level,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        category_id: categories[0]?.id || '',
        supplier_id: suppliers[0]?.id || '',
        unit_price: 0,
        stock_quantity: 0,
        min_stock_level: 5,
      });
    }
  }, [product, categories, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        const savedProducts = localStorage.getItem('demo_products');
        let products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];

        if (product) {
          // Update
          products = products.map(p => p.id === product.id ? { 
            ...p, 
            ...formData, 
            updated_at: new Date().toISOString(),
            category: categories.find(c => c.id === formData.category_id),
            supplier: suppliers.find(s => s.id === formData.supplier_id)
          } : p);
          toast.success('Product updated successfully (Demo Mode)');
        } else {
          // Create
          const newProduct: Product = {
            id: `prod-${Date.now()}`,
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: categories.find(c => c.id === formData.category_id),
            supplier: suppliers.find(s => s.id === formData.supplier_id)
          };
          products.push(newProduct);
          toast.success('Product added successfully (Demo Mode)');
        }

        localStorage.setItem('demo_products', JSON.stringify(products));
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error('An error occurred in demo mode');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Product Name</label>
              <input
                required
                type="text"
                className="input"
                placeholder="e.g. Organic Bananas"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">SKU / Barcode</label>
              <input
                required
                type="text"
                className="input"
                placeholder="e.g. PROD-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select
                required
                className="input"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Supplier</label>
              <select
                required
                className="input"
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              >
                <option value="" disabled>Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className="input"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
              <input
                required
                type="number"
                min="0"
                className="input"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Min Stock Level (Alert)</label>
              <input
                required
                type="number"
                min="0"
                className="input"
                value={formData.min_stock_level}
                onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              className="input min-h-[100px] py-3"
              placeholder="Enter product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary min-w-[120px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
