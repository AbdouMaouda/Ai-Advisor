import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import PageContainer from "../components/layout/PageContainer.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Section from "../components/layout/Section.jsx";
import Panel from "../components/layout/Panel.jsx";
import { Menu, X, TrendingUp, TrendingDown, DollarSign, Users, Activity } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <PageContainer>
      
      {/* Mobile Toggle */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-white border border-gray-200"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 ${
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
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
        <PageHeader
          badge={
            <>
              <Activity size={14} />
              <span className="font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </>
          }
          title="Dashboard"
          subtitle="Real-time overview of your business metrics and performance"
        />

        {/* Stats Bar */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-8 lg:px-12 py-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Health Score
                </p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">out of 100</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Revenue
                </p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">this month</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Customers
                </p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">total active</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  Growth
                </p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="px-8 lg:px-12 py-8">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column - 8 cols */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* Revenue Section */}
              <Panel variant="bordered">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Total Revenue
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-semibold text-gray-900">—</span>
                      <span className="text-sm text-gray-500">No data</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded text-sm font-medium text-gray-600">
                      <TrendingUp size={14} />
                      —
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs last period</p>
                  </div>
                </div>
                
                {/* Mini Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">MRR</p>
                    <p className="text-lg font-semibold text-gray-900">—</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg Order</p>
                    <p className="text-lg font-semibold text-gray-900">—</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Growth</p>
                    <p className="text-lg font-semibold text-gray-900">—</p>
                  </div>
                </div>
              </Panel>

              {/* Customer Metrics Table */}
              <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Customer Metrics</h3>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-gray-200">
                  {[
                    { label: 'Total Customers', value: '—', change: null, icon: Users },
                    { label: 'New This Month', value: '—', change: '—', positive: true, icon: TrendingUp },
                    { label: 'Churn Rate', value: '—', change: '—', positive: false, icon: TrendingDown },
                    { label: 'Avg Customer Value', value: '—', change: '—', positive: true, icon: DollarSign }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded">
                            <Icon size={18} className="text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {item.change && (
                            <span className={`text-xs font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                              {item.change}
                            </span>
                          )}
                          <span className="text-base font-semibold text-gray-900 min-w-[60px] text-right">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart Placeholder */}
              <Panel variant="bordered">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded border border-gray-200">
                  <Activity size={32} className="text-gray-400 mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-gray-600">No data to display</p>
                  <p className="text-xs text-gray-500 mt-1">Connect data sources to see trends</p>
                </div>
              </Panel>
            </div>

            {/* Right Sidebar - 4 cols */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-6 space-y-6">
                
                {/* Health Score - Dark Panel */}
                <Panel variant="dark">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Health Score
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">—</span>
                        <span className="text-gray-400 text-lg">/100</span>
                      </div>
                    </div>
                    <Activity size={24} className="text-gray-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Revenue Growth</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Customer Retention</span>
                      <span className="font-medium">—</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Payment Success</span>
                      <span className="font-medium">—</span>
                    </div>
                  </div>
                </Panel>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <Panel variant="bordered" className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Active Subscriptions
                      </span>
                      <Users size={16} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">—</p>
                  </Panel>
                  
                  <Panel variant="bordered" className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Pending Invoices
                      </span>
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">—</p>
                  </Panel>
                </div>

                {/* CTA */}
                <Panel variant="default">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Connect Your Data
                  </h4>
                  <p className="text-xs text-gray-600 mb-4">
                    Link your tools to see real-time metrics
                  </p>
                  <button className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </Panel>

              </div>
            </aside>

          </div>
        </div>

      </main>
    </PageContainer>
  );
}