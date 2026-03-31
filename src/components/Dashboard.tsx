import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { MOCK_PRODUCTS, MOCK_SUPPLIERS } from '../lib/mockData';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
    activeSuppliers: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const products = MOCK_PRODUCTS;
      const totalProducts = products.length;
      const lowStock = products.filter(p => p.stock_quantity <= p.min_stock_level).length;
      const totalValue = products.reduce((sum, p) => sum + (p.unit_price * p.stock_quantity), 0);

      setStats({
        totalProducts,
        lowStock,
        totalValue,
        activeSuppliers: MOCK_SUPPLIERS.length
      });

      setChartData([
        { name: 'Mon', stock: 400, sales: 240 },
        { name: 'Tue', stock: 300, sales: 139 },
        { name: 'Wed', stock: 200, sales: 980 },
        { name: 'Thu', stock: 278, sales: 390 },
        { name: 'Fri', stock: 189, sales: 480 },
        { name: 'Sat', stock: 239, sales: 380 },
        { name: 'Sun', stock: 349, sales: 430 },
      ]);
      setLoading(false);
    }, 500);
  }

  const statCards = [
    { 
      label: 'Total Products', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Low Stock Items', 
      value: stats.lowStock, 
      icon: AlertTriangle, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '-2',
      trendUp: false
    },
    { 
      label: 'Inventory Value', 
      value: formatCurrency(stats.totalValue), 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+5.4%',
      trendUp: true
    },
    { 
      label: 'Active Suppliers', 
      value: stats.activeSuppliers, 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      trend: 'Steady',
      trendUp: true
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time inventory insights and performance metrics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-6 flex flex-col justify-between group hover:border-brand-200 transition-all">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Stock Levels vs Sales</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="stock" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorStock)" strokeWidth={3} />
                <Area type="monotone" dataKey="sales" stroke="#10b981" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Category Distribution</h3>
            <button className="text-brand-600 text-sm font-semibold">View Details</button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0'}}
                />
                <Bar dataKey="stock" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
