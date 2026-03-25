import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { Menu, X, ArrowLeft, AlertCircle, Clock, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionDetails() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-stone-50">

      {/* SIDEBAR BUTTON */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-20 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <Menu size={22} />
        </button>
      )}

      {/* NAV SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-200"
        >
          <X size={22} />
        </button>

        <Sidebar />

      </aside>


      {/* MAIN CONTENT */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>

        <div className="mx-auto max-w-[1440px] px-6 py-10">

          {/* TOP NAV */}
          <div className="flex items-center gap-4 mb-10">

            <Link
              to="/dailybrief"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Daily Brief
            </Link>

          </div>


          {/* HEADER */}
          <div className="mb-10">

            <h1 className="text-4xl font-semibold text-gray-900 mb-2">
              Action Items
            </h1>

            <p className="text-gray-600 max-w-xl">
              AI-generated recommendations based on your business metrics and performance signals.
            </p>

          </div>


          {/* MAIN GRID */}
          <div className="grid grid-cols-12 gap-6">

            {/* LEFT COLUMN */}
            <div className="col-span-12 lg:col-span-8 space-y-6">


              {/* URGENT */}
              <ActionSection
                icon={AlertCircle}
                title="Urgent"
                color="red"
                text="No urgent actions detected. Your system is operating normally."
              />


              {/* MODERATE */}
              <ActionSection
                icon={Clock}
                title="Moderate"
                color="orange"
                text="No moderate priority actions right now."
              />


              {/* LOW PRIORITY */}
              <ActionSection
                icon={Target}
                title="Low Priority"
                color="blue"
                text="No recommendations available at the moment."
              />

            </div>


            {/* RIGHT SIDEBAR */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              <div className="bg-white border border-gray-200 rounded-2xl p-6">

                <div className="flex items-center justify-between mb-4">

                  <div>

                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Total Actions
                    </p>

                    <p className="text-4xl font-semibold">
                      0
                    </p>

                  </div>

                  <Zap className="text-amber-500" size={26} />

                </div>

                <div className="space-y-2 text-sm text-gray-600">

                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span>—</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Avg Response</span>
                    <span>—</span>
                  </div>

                </div>

              </div>


              {/* AI PANEL */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">

                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                  AI Monitoring
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  Connect your business data to enable automated action detection.
                </p>

                <button className="w-full bg-gray-900 text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800">
                  Connect Data Source
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}



function ActionSection({ icon: Icon, title, color, text }) {

  const colors = {
    red: "border-red-200 bg-red-50 text-red-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700"
  };

  return (

    <div className="bg-white border border-gray-200 rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-4">

        <Icon className={`${colors[color]} p-2 rounded-lg`} size={28} />

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

      </div>

      <p className="text-sm text-gray-600">
        {text}
      </p>

    </div>

  );

}