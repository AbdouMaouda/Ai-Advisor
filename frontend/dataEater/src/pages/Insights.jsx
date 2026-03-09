import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, Sparkles, Brain, ArrowRight } from "lucide-react";

export default function Insights() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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
        
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="px-8 lg:px-12 py-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <Sparkles size={16} />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">
              Insights
            </h1>
            <p className="text-gray-600 max-w-2xl">
              AI-driven analysis of your business data to uncover patterns, predict trends, and identify opportunities
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-8 lg:px-12 py-6">
            <div className="grid grid-cols-4 gap-8">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Total Insights</p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Opportunities</p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Risks</p>
                <p className="text-3xl font-semibold text-gray-900">—</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Last Updated</p>
                <p className="text-3xl font-semibold text-gray-400">—</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-8 lg:px-12 py-12">
          <div className="max-w-3xl mx-auto">
            
            {/* Empty State */}
            <div className="text-center py-20">
              
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Brain size={40} className="text-gray-400" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No Insights Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Connect your data sources to enable AI analysis. We'll automatically generate insights from your business metrics.
              </p>

              {/* CTA */}
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                Connect Data Sources
                <ArrowRight size={16} />
              </button>

            </div>

            {/* Divider */}
            <div className="relative my-16">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-gray-500 bg-white">What you'll get</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-6">
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Pattern Detection</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our AI identifies hidden patterns in your data that would be impossible to spot manually
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Predictive Analysis</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Get forecasts for revenue, customer behavior, and business trends based on historical data
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">3</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Opportunity Identification</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Discover untapped revenue streams and growth opportunities you might be missing
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">4</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Risk Alerts</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Early warnings about potential issues like customer churn or declining metrics
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Info */}
            <div className="mt-16 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Sparkles size={20} className="text-gray-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">How it works</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Once connected, our AI continuously analyzes your data in real-time. 
                    Insights are automatically generated and updated as your business evolves.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}