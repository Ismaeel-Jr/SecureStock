import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { Product, Category, Supplier } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import ProductModal from './ProductModal';
import { toast } from 'sonner';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SUPPLIERS } from '../lib/mockData';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Load from local storage or mock data
      const savedProducts = localStorage.getItem('demo_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(MOCK_PRODUCTS);
        localStorage.setItem('demo_products', JSON.stringify(MOCK_PRODUCTS));
      }
      setCategories(MOCK_CATEGORIES);
      setSuppliers(MOCK_SUPPLIERS);
      setLoading(false);
    }, 500);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? (Demo Mode)')) return;
    
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('demo_products', JSON.stringify(updatedProducts));
    toast.success('Product deleted successfully (Demo Mode)');
  };

  const handleSuccess = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Manage your supermarket stock levels and product details.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="btn btn-primary gap-2 self-start"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </header>

      {/* Filters & Search */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn btn-secondary gap-2 flex-1 md:flex-none">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="btn btn-secondary gap-2 flex-1 md:flex-none">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No products found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isLowStock = product.stock_quantity <= product.min_stock_level;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{product.name}</span>
                        <span className="text-xs text-slate-500">SKU: {product.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatCurrency(product.unit_price)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-bold",
                          isLowStock ? "text-red-600" : "text-slate-900"
                        )}>
                          {product.stock_quantity}
                        </span>
                        {isLowStock && <AlertCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        isLowStock ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                      )}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setShowModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{filteredProducts.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="btn btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
            <button className="btn btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <ProductModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        product={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
}
