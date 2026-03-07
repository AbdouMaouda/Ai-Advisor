import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, TrendingUp, TrendingDown, DollarSign, Users, CreditCard, FileText, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const metricTabs = [
    { id: "customers", label: "Customer Metrics", icon: Users },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "revenue", label: "Revenue", icon: DollarSign },
  ];

  const currentMetrics = [
    { title: "Total Customers", value: "—", change: "—", trend: "up", icon: Users },
    { title: "New This Month", value: "—", change: "—", trend: "up", icon: TrendingUp },
    { title: "Churn Rate", value: "—", change: "—", trend: "down", icon: TrendingDown },
    { title: "Avg Customer Value", value: "—", change: "—", trend: "up", icon: DollarSign },
  ];

  const healthScore = "—";

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors bg-white shadow-sm"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-200 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
        
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className={`p-8 lg:p-12 transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-0'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Overview of your business metrics and performance
            </p>
          </div>

          {/* Health Score Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-600 font-semibold mb-2">
                  Business Health Score
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-bold text-gray-400">
                    {healthScore}
                  </span>
                  <span className="text-2xl text-gray-500">/100</span>
                </div>
                <p className="text-gray-600 mt-3">
                  Connect your data sources to see your health score
                </p>
              </div>
              <div className="hidden md:block">
                <Activity size={80} className="text-gray-400" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Health Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-300">
              <div>
                <p className="text-xs text-gray-600 mb-1">Revenue Growth</p>
                <p className="text-lg font-bold text-gray-400">—</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Customer Retention</p>
                <p className="text-lg font-bold text-gray-400">—</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Success</p>
                <p className="text-lg font-bold text-gray-400">—</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Cash Flow</p>
                <p className="text-lg font-bold text-gray-400">—</p>
              </div>
            </div>
          </div>

          {/* Metric Tabs */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {metricTabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      index === 0
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {currentMetrics.map((metric, index) => {
              const Icon = metric.icon;
              
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <Icon size={24} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-400">
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-400">{metric.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Line Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h3>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Customer & Subscription Growth</h3>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}