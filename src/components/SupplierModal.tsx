import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Supplier } from '../types';
import { toast } from 'sonner';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: Supplier | null;
}

export default function SupplierModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  supplier 
}: SupplierModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
      });
    } else {
      setFormData({
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [supplier]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        const savedSuppliers = localStorage.getItem('demo_suppliers');
        let suppliers: Supplier[] = savedSuppliers ? JSON.parse(savedSuppliers) : [];

        if (supplier) {
          // Update
          suppliers = suppliers.map(s => s.id === supplier.id ? { ...s, ...formData } : s);
          toast.success('Supplier updated successfully (Demo Mode)');
        } else {
          // Create
          const newSupplier: Supplier = {
            id: `sup-${Date.now()}`,
            ...formData,
          };
          suppliers.push(newSupplier);
          toast.success('Supplier added successfully (Demo Mode)');
        }

        localStorage.setItem('demo_suppliers', JSON.stringify(suppliers));
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Name</label>
            <input
              required
              type="text"
              className="input"
              placeholder="e.g. Fresh Farms Co."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contact Person</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Sarah Jenkins"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="contact@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                className="input"
                placeholder="555-0101"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Address</label>
            <textarea
              className="input min-h-[80px] py-3"
              placeholder="Enter business address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (supplier ? 'Update Supplier' : 'Add Supplier')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
