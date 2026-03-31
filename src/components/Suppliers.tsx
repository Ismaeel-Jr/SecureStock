import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Edit2,
  Trash2
} from 'lucide-react';
import { Supplier } from '../types';
import SupplierModal from './SupplierModal';
import { toast } from 'sonner';
import { MOCK_SUPPLIERS } from '../lib/mockData';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const savedSuppliers = localStorage.getItem('demo_suppliers');
      if (savedSuppliers) {
        setSuppliers(JSON.parse(savedSuppliers));
      } else {
        setSuppliers(MOCK_SUPPLIERS);
        localStorage.setItem('demo_suppliers', JSON.stringify(MOCK_SUPPLIERS));
      }
      setLoading(false);
    }, 500);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier? (Demo Mode)')) return;
    
    const updatedSuppliers = suppliers.filter(s => s.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem('demo_suppliers', JSON.stringify(updatedSuppliers));
    toast.success('Supplier deleted successfully (Demo Mode)');
  };

  const handleSuccess = () => {
    fetchSuppliers();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500 mt-1">Manage your supermarket supplier relationships and contact info.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSupplier(null);
            setShowModal(true);
          }}
          className="btn btn-primary gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </header>

      <div className="card p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search suppliers..." 
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card p-6 h-48 animate-pulse bg-slate-100" />
          ))
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No suppliers found.
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="card group hover:border-brand-200 transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold text-xl">
                    {supplier.name[0]}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingSupplier(supplier);
                        setShowModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(supplier.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{supplier.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{supplier.contact_name || 'No contact person'}</p>
                
                <div className="space-y-2">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{supplier.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Partner</span>
                <button className="text-brand-600 hover:text-brand-700 text-sm font-semibold flex items-center gap-1">
                  View Products <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <SupplierModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        supplier={editingSupplier}
      />
    </div>
  );
}
