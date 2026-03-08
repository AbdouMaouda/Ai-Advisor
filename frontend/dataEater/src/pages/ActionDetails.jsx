import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, AlertCircle, Clock, CheckCircle, ArrowLeft, Search, Zap, Target, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("all");

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const priorityFilters = [
    { 
      id: "all", 
      label: "All Actions", 
      count: 0,
      gradient: "from-purple-500 to-blue-500",
      icon: Target
    },
    { 
      id: "urgent", 
      label: "Urgent", 
      count: 0, 
      gradient: "from-red-500 to-pink-500",
      icon: Zap
    },
    { 
      id: "moderate", 
      label: "Moderate", 
      count: 0, 
      gradient: "from-orange-500 to-yellow-500",
      icon: Clock
    },
    { 
      id: "low", 
      label: "Low Priority", 
      count: 0, 
      gradient: "from-blue-500 to-cyan-500",
      icon: Coffee
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-white/80 transition-all bg-white/60 backdrop-blur-sm shadow-lg"
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
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Back Button */}
          <div className="mb-10">
            <button className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all">
              < Link to="/dailybrief" className="p-1 rounded-lg group-hover:bg-gray-200 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <Link to="/dailybrief" className="font-semibold">
                Back to Daily Brief
              </Link>
            </button>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
              <h1 className="text-5xl font-black text-gray-900 mb-3 relative">
                Action Items
              </h1>
              <p className="text-gray-600 text-xl relative">
                Your personalized to-do list, powered by AI
              </p>
            </div>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-8">
            {/* Creative Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 px-4">
                  <Search className="text-gray-400" size={22} />
                  <input
                    type="text"
                    placeholder="Search for actions, keywords, or priorities..."
                    className="flex-1 py-3 bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 text-lg"
                    disabled
                  />
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-sm opacity-50 cursor-not-allowed">
                    Search
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Priority Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {priorityFilters.map((filter) => {
                const Icon = filter.icon;
                const isSelected = selectedPriority === filter.id;
                
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedPriority(filter.id)}
                    className={`group relative flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                      isSelected 
                        ? 'scale-105 shadow-xl' 
                        : 'hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} rounded-2xl transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>
                    
                    {/* White Background for non-selected */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-white rounded-2xl group-hover:opacity-0 transition-opacity"></div>
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-white/20'
                      }`}>
                        <Icon 
                          size={20} 
                          className={isSelected ? 'text-white' : 'text-gray-700 group-hover:text-white'}
                        />
                      </div>
                      <span className={isSelected ? 'text-white' : 'text-gray-700 group-hover:text-white'}>
                        {filter.label}
                      </span>
                      <div className={`px-2.5 py-1 rounded-full text-sm font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-700 group-hover:bg-white/20 group-hover:text-white'
                      }`}>
                        {filter.count}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Creative Empty State */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative bg-white/60 backdrop-blur-xl border-2 border-gray-200/50 rounded-3xl p-20 text-center shadow-2xl">
              <div className="max-w-xl mx-auto">
                {/* Animated Icon */}
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto border-4 border-green-200">
                    <CheckCircle className="text-green-600" size={56} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Heading */}
                <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  All Clear! 🎉
                </h2>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  No action items right now. Connect your data sources and let our AI find opportunities and issues for you to tackle.
                </p>

                {/* CTA Button */}
                <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative text-white flex items-center gap-3">
                    <Zap size={24} className="group-hover:rotate-12 transition-transform" />
                    Connect Data Sources
                  </span>
                </button>

                {/* Decorative text */}
                <p className="mt-6 text-sm text-gray-500 font-medium">
                  We'll analyze your business data 24/7
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}