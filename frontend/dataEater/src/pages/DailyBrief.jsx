import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, ArrowRight, Sparkles, AlertCircle, Clock, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      
      {/* Mobile Toggle Button */}
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
        
        {/* Header Section */}
        <div className="border-b border-gray-200">
          <div className="px-8 lg:px-12 py-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Sparkles size={16} />
                <span className="font-medium">AI-Powered</span>
                <span className="text-gray-300">•</span>
                <time>{briefDate}</time>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">
                Daily Brief
              </h1>
              <p className="text-gray-600">
                Your personalized business intelligence report
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-8 lg:px-12 py-8">
          <div className="max-w-4xl space-y-12">
            
            {/* Executive Summary Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Executive Summary</h2>
              </div>
              
              <div className="pl-7">
                <div className="border-l-2 border-gray-200 pl-6 py-4">
                  <p className="text-gray-500 italic">
                    Connect your data sources to receive an AI-generated summary of your business performance, key metrics, and actionable insights.
                  </p>
                </div>
                
                <button className="mt-4 ml-6 inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 transition-colors">
                  View Full Analysis
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* Key Highlights Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gray-900 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Key Highlights</h2>
              </div>
              
              <div className="pl-7">
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                    <Sparkles size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">No highlights to display</p>
                  <p className="text-xs text-gray-500 mt-1">Connect your data sources to see insights</p>
                </div>
              </div>
            </section>

            {/* Actions Required Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gray-900 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Actions Required</h2>
              </div>
              
              <div className="pl-7 space-y-6">
                
                {/* Urgent Actions */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                      <AlertCircle size={14} className="text-red-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Urgent</h3>
                    <span className="text-xs text-gray-500 font-medium">0 items</span>
                  </div>
                  
                  <div className="ml-9 py-6 border-l-2 border-red-100 pl-6">
                    <p className="text-sm text-gray-500">No urgent actions at this time</p>
                  </div>
                </div>

                {/* Moderate Priority */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full">
                      <Clock size={14} className="text-orange-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Moderate</h3>
                    <span className="text-xs text-gray-500 font-medium">0 items</span>
                  </div>
                  
                  <div className="ml-9 py-6 border-l-2 border-orange-100 pl-6">
                    <p className="text-sm text-gray-500">No moderate priority actions</p>
                  </div>
                </div>

                {/* Low Priority */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                      <CheckCircle size={14} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Low Priority</h3>
                    <span className="text-xs text-gray-500 font-medium">0 items</span>
                  </div>
                  
                  <div className="ml-9 py-6 border-l-2 border-blue-100 pl-6">
                    <p className="text-sm text-gray-500">No low priority actions</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Footer CTA */}
            <section className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Want more detailed insights?
                  </h3>
                  <p className="text-sm text-gray-600">
                    View the complete analysis with charts and recommendations
                  </p>
                </div>
                <button 
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded hover:bg-gray-200 transition-colors cursor-not-allowed"
                >
                  View Full Report
                </button>
              </div>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}