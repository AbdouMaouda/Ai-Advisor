import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, ArrowLeft, Search, Zap, AlertCircle, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-white/80 transition-colors bg-white shadow-sm"
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

      {/* Main Content - Unique Asymmetric Layout */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
        {/* Floating Command Bar - Unique Element */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
          <div className="px-8 lg:px-12 py-4">
            <div className="flex items-center gap-4">
              
              {/* Back Nav */}
              <Link 
                to="/dailybrief" 
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={16} />
                <span className="font-medium">Daily Brief</span>
              </Link>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Priority Toggles - Inline Tabs */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: "all", label: "All", count: 0 },
                  { id: "urgent", label: "Urgent", count: 0 },
                  { id: "moderate", label: "Moderate", count: 0 },
                  { id: "low", label: "Low", count: 0 }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedPriority(filter.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                      selectedPriority === filter.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.label} {filter.count > 0 && `· ${filter.count}`}
                  </button>
                ))}
              </div>

              {/* Search - Compact Command Style */}
              <div className="flex-1 max-w-md ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search actions... ⌘K"
                    className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:outline-none transition-all"
                    disabled
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Hero Section - Large Typography */}
        <div className="px-8 lg:px-12 pt-16 pb-12">
          <div className="max-w-6xl">
            <h1 className="text-[56px] leading-[1.1] font-bold text-gray-900 mb-4 tracking-tight">
              Action Items
            </h1>
            <p className="text-xl text-gray-600 font-light">
              AI-prioritized tasks based on your business data
            </p>
          </div>
        </div>

        {/* Content Grid - Kanban-Inspired Layout */}
        <div className="px-8 lg:px-12 pb-16">
          <div className="grid grid-cols-12 gap-6 max-w-6xl">
            
            {/* Left Column - 8 cols - Action Lists */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* Urgent Section - Red Accent */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Urgent</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">0</span>
                    <span>items</span>
                  </div>
                </div>
                
                {/* Empty State - Inline */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-8 transition-all group-hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <AlertCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">All clear</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        No urgent actions detected. We'll alert you if anything critical comes up.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Moderate Section - Orange Accent */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-orange-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Moderate</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">0</span>
                    <span>items</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-r-xl p-8 transition-all group-hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Clock size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Nothing pending</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        No moderate priority items at the moment. Focus on long-term goals.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Low Priority Section - Blue Accent */}
              <section className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Low Priority</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">0</span>
                    <span>items</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-r-xl p-8 transition-all group-hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Target size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Looking good</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        No low priority tasks. Your operations are running smoothly.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Sidebar - 4 cols - Info Panel */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* Status Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Total Actions
                      </p>
                      <p className="text-5xl font-bold">0</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Zap size={24} className="text-yellow-400" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="font-semibold">—</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Avg Response Time</span>
                      <span className="font-semibold">—</span>
                    </div>
                  </div>
                </div>

                {/* AI Insight Box */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      AI Monitoring
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Connect your data sources to enable continuous monitoring. We'll automatically surface action items as they arise.
                  </p>
                  <button className="w-full mt-4 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                    Get Started
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500 mt-1">actions completed</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">—</p>
                    <p className="text-xs text-gray-500 mt-1">average hours</p>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>

      </main>
    </div>
  );
}