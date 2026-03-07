import {
  LayoutDashboard,
  Newspaper,
  Brain,
  Zap,
  MessageCircle,
  Settings
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-full bg-gray-50 p-6 flex flex-col">
      
      {/* Logo/Title - with padding to avoid overlap with close button */}
      <div className="pt-12 pb-8">
        <h1 className="text-2xl font-bold text-gray-900">DataEater</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8">
        
        {/* Overview */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 px-3">
            Overview
          </h4>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <Newspaper size={20} />
              <span className="font-medium">Daily Brief</span>
            </button>
          </div>
        </div>

        {/* AI */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 px-3">
            AI
          </h4>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <Brain size={20} />
              <span className="font-medium">Insights</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <Zap size={20} />
              <span className="font-medium">Actions</span>
            </button>
          </div>
        </div>

        {/* Systems */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 px-3">
            Systems
          </h4>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <MessageCircle size={20} />
              <span className="font-medium">Ask DataEater</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-700 hover:text-gray-900">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>

      </nav>
    </div>
  );
}