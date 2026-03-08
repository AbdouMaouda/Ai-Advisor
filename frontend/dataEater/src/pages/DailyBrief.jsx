import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, ArrowRight, Sparkles, Calendar } from "lucide-react";

export default function DailyBrief() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const briefDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-purple-600" size={32} />
              <h1 className="text-4xl font-bold text-gray-900">
                Daily Brief
              </h1>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <p className="text-lg">{briefDate}</p>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">AI-Generated Summary</h2>
                <div className="bg-white/50 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                  <p className="text-gray-500">Connect your data sources to generate your daily AI summary</p>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 text-purple-700 hover:text-purple-800 font-semibold transition-colors opacity-50 cursor-not-allowed">
              View Full AI Analysis
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Key Highlights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Highlights</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center">
              <Sparkles className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-500 text-lg">No highlights available yet</p>
              <p className="text-gray-400 text-sm mt-2">Connect your data sources to see daily insights</p>
            </div>
          </div>

          {/* Actions to Solve */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions Required</h2>
            
            {/* Urgent */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-red-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Urgent</h3>
                <span className="text-sm bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                  0
                </span>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
                <AlertCircle className="text-red-300 mx-auto mb-3" size={40} />
                <p className="text-gray-600">No urgent actions at this time</p>
              </div>
            </div>

            {/* Moderate */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-orange-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Moderate Priority</h3>
                <span className="text-sm bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                  0
                </span>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-8 text-center">
                <Clock className="text-orange-300 mx-auto mb-3" size={40} />
                <p className="text-gray-600">No moderate priority actions</p>
              </div>
            </div>

            {/* Not Urgent */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Low Priority</h3>
                <span className="text-sm bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                  0
                </span>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                <CheckCircle className="text-blue-300 mx-auto mb-3" size={40} />
                <p className="text-gray-600">No low priority actions</p>
              </div>
            </div>
          </div>

          {/* View Full Report Button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed" disabled>
              View Full Detailed Report
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}