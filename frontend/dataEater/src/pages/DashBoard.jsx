import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { 
  Menu, X, TrendingUp, TrendingDown, DollarSign, Users, 
  CreditCard, Activity, ChevronDown, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, FileText
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [timeRange, setTimeRange] = useState("weekly");

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const metrics = [
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "customers", label: "Customers", icon: Users },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "invoices", label: "Invoices", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      
      {/* Mobile Toggle */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-white transition-colors bg-white shadow-sm border border-gray-200"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Activity
                </button>
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Reports
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={18} className="text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                Connect Data
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 relative">
          
          {/* Floating Vertical Metric Selector - Exact Style */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-[28px] shadow-lg p-2.5 flex flex-col gap-2">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const isActive = selectedMetric === metric.id;
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-orange-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    title={metric.label}
                  >
                    <Icon 
                      size={24} 
                      className={isActive ? 'text-orange-600' : 'text-gray-500'}
                      strokeWidth={1.5}
                    />
                    
                    {/* Tooltip on hover */}
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                      {metric.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto pl-24">
            
            {/* Welcome Section */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Business Overview
              </h2>
              <p className="text-lg text-gray-600">
                Monitor your revenue, customers, and key metrics
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Column - 8 cols */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Summary Card - Large */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Performance Summary</p>
                      <p className="text-xs text-gray-500">Track your business metrics</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200">
                      Weekly
                      <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <DollarSign size={16} className="text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Revenue</p>
                      </div>
                      <p className="text-5xl font-bold text-gray-400 mb-2">—</p>
                      <p className="text-sm text-gray-500">No data available</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <TrendingUp size={16} className="text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Monthly Recurring Revenue</p>
                      </div>
                      <p className="text-5xl font-bold text-gray-400 mb-2">—</p>
                      <p className="text-sm text-gray-500">No data available</p>
                    </div>
                  </div>

                  {/* Chart Area - Placeholder */}
                  <div className="h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="text-center">
                      <Activity size={40} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-sm font-medium text-gray-600 mb-1">No data to display</p>
                      <p className="text-xs text-gray-500">Connect your data sources to see trends</p>
                    </div>
                  </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <Users size={22} className="text-orange-600" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        This Month
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">New Customers</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-400">—</span>
                      </div>
                    </div>
                    {/* Mini chart placeholder */}
                    <div className="h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 font-medium">No activity</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <CreditCard size={22} className="text-orange-600" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Active
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Subscriptions</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-400">—</span>
                      </div>
                    </div>
                    <div className="h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 font-medium">No activity</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <FileText size={22} className="text-orange-600" />
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Pending
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Invoices</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-400">—</span>
                      </div>
                    </div>
                    <div className="h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 font-medium">No activity</span>
                    </div>
                  </div>

                  {/* Card 4 - Dark */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <TrendingDown size={22} className="text-white" />
                      </div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        30 Days
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-300 mb-2">Churn Rate</p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-500">—</span>
                      </div>
                    </div>
                    <div className="h-16 flex items-center justify-center bg-white/5 rounded-lg">
                      <span className="text-xs text-gray-500 font-medium">No activity</span>
                    </div>
                  </div>

                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <p className="text-xs text-gray-500 mt-1">Latest transactions and events</p>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Filter size={18} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="p-20 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-5">
                      <Activity size={36} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      No activity yet
                    </h4>
                    <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Connect your Stripe account to see transactions, subscriptions, and customer activity in real-time
                    </p>
                    <button className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                      Connect Stripe
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Sidebar - 4 cols */}
              <aside className="col-span-12 lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-6">
                  
                  {/* Health Score - Dark Panel */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          Business Health
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-bold text-gray-500">—</span>
                          <span className="text-gray-500 text-xl font-semibold">/100</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Revenue Growth</span>
                        <span className="font-semibold text-gray-500">—</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Retention Rate</span>
                        <span className="font-semibold text-gray-500">—</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Payment Success</span>
                        <span className="font-semibold text-gray-500">—</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Weekly Average
                        </span>
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <p className="text-3xl font-bold text-gray-400 mb-1">—</p>
                      <p className="text-xs text-gray-500">Revenue per week</p>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                          Customer LTV
                        </span>
                        <Users size={16} className="text-gray-400" />
                      </div>
                      <p className="text-3xl font-bold text-gray-400 mb-1">—</p>
                      <p className="text-xs text-gray-500">Lifetime value</p>
                    </div>
                  </div>

                  {/* CTA Panel */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      Start Tracking
                    </h4>
                    <p className="text-xs text-gray-700 mb-5 leading-relaxed">
                      Connect your Stripe account to unlock real-time insights and analytics
                    </p>
                    <button className="w-full px-4 py-3 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
                      Connect Now
                    </button>
                  </div>

                </div>
              </aside>

            </div>

          </div>
        </div>

      </main>
    </div>
  );
}