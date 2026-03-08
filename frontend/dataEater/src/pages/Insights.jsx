import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, Sparkles, TrendingUp, Brain, Zap, Eye, Layers, ChevronRight, Calendar, Grid, List } from "lucide-react";

export default function Insights() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Animated Background Elements - Subtle */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-200 to-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-3 rounded-2xl bg-white border-2 border-cyan-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-100 transition-all"
          aria-label="Open sidebar"
        >
          <Menu size={22} className="text-gray-700" />
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
      <main className={`relative z-10 p-8 lg:p-12 transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-0'
      }`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-8">
              <div className="relative">
                {/* Subtle glow behind title */}
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-cyan-300 to-emerald-300 rounded-full blur-3xl opacity-20"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Unique 3D-looking icon */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative p-4 bg-gradient-to-br from-cyan-500 via-blue-500 to-emerald-500 rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform">
                        <Brain className="text-white" size={36} strokeWidth={2} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-emerald-100 border-2 border-cyan-200 rounded-full">
                          <span className="text-xs font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={12} />
                            AI-Powered
                          </span>
                        </div>
                      </div>
                      <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        Insights
                      </h1>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xl font-medium ml-20">
                    Deep intelligence from your business data
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 p-1.5 bg-gray-100 border-2 border-gray-200 rounded-2xl">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === "cards"
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid size={20} className={viewMode === "cards" ? "text-white" : "text-gray-600"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl transition-all ${
                    viewMode === "list"
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <List size={20} className={viewMode === "list" ? "text-white" : "text-gray-600"} />
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all"></div>
                <div className="relative p-6 bg-white border-2 border-cyan-200 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl">
                      <Eye size={22} className="text-cyan-600" />
                    </div>
                    <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Insights</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800">—</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all"></div>
                <div className="relative p-6 bg-white border-2 border-emerald-200 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      <TrendingUp size={22} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Opportunities</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800">—</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all"></div>
                <div className="relative p-6 bg-white border-2 border-blue-200 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                      <Zap size={22} className="text-blue-600" />
                    </div>
                    <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Critical</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800">—</p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200 to-emerald-200 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all"></div>
                <div className="relative p-6 bg-white border-2 border-cyan-200 rounded-2xl shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-xl">
                      <Layers size={22} className="text-cyan-600" />
                    </div>
                    <span className="text-gray-600 text-sm font-bold uppercase tracking-wide">Categories</span>
                  </div>
                  <p className="text-4xl font-black text-gray-800">—</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Empty State */}
          <div className="relative">
            {/* Decorative elements - subtle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative">
              {/* Unique card design */}
              <div className="relative group">
                {/* Outer glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                {/* Main card */}
                <div className="relative bg-white border-2 border-cyan-200 rounded-3xl p-16 shadow-xl hover:shadow-2xl transition-all">
                  
                  {/* Central icon with orbiting elements */}
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-spin-slow">
                      <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-500 rounded-full -translate-x-1/2 shadow-lg shadow-cyan-400/50"></div>
                      <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 shadow-lg shadow-emerald-400/50"></div>
                      <div className="absolute left-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-y-1/2 shadow-lg shadow-blue-400/50"></div>
                      <div className="absolute right-0 top-1/2 w-3 h-3 bg-teal-500 rounded-full -translate-y-1/2 shadow-lg shadow-teal-400/50"></div>
                    </div>
                    
                    {/* Central brain icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-2xl blur-xl opacity-40"></div>
                        <div className="relative p-6 bg-gradient-to-br from-cyan-500 via-blue-500 to-emerald-500 rounded-2xl shadow-2xl">
                          <Brain size={48} className="text-white" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text mb-4">
                      Your AI Brain is Ready
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                      Connect your data sources and watch as our AI analyzes millions of data points to surface 
                      insights you never knew existed. We find patterns, predict trends, and highlight opportunities 
                      in real-time.
                    </p>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                      <div className="relative group/item">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-30 transition-all"></div>
                        <div className="relative p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl hover:shadow-lg transition-all">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <Sparkles className="text-white" size={24} />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">Pattern Detection</h3>
                          <p className="text-sm text-gray-600">Spot trends before they become obvious</p>
                        </div>
                      </div>

                      <div className="relative group/item">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-30 transition-all"></div>
                        <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl hover:shadow-lg transition-all">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <TrendingUp className="text-white" size={24} />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">Growth Predictions</h3>
                          <p className="text-sm text-gray-600">Know what's coming next month</p>
                        </div>
                      </div>

                      <div className="relative group/item">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-30 transition-all"></div>
                        <div className="relative p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl hover:shadow-lg transition-all">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                            <Zap className="text-white" size={24} />
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2">Instant Alerts</h3>
                          <p className="text-sm text-gray-600">Get notified of critical changes</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA button */}
                    <button className="group/cta relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 animate-gradient-x"></div>
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 blur-xl opacity-0 group-hover/cta:opacity-30 transition-opacity"></div>
                      
                      {/* Button content */}
                      <span className="relative text-white flex items-center gap-3">
                        <Sparkles size={24} className="group-hover/cta:rotate-180 transition-transform duration-500" />
                        Activate AI Insights
                        <ChevronRight size={24} className="group-hover/cta:translate-x-2 transition-transform" />
                      </span>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </button>

                    <p className="mt-6 text-gray-500 text-sm font-medium">
                      ⚡ Processing happens in real-time • 🔒 Your data stays secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline preview */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-transparent to-emerald-200 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-lg">
                      <Calendar className="text-cyan-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Insight Timeline</h3>
                  </div>
                  <div className="flex items-center justify-center py-12">
                    <p className="text-gray-500 text-lg">Your insights will appear here as they're generated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}