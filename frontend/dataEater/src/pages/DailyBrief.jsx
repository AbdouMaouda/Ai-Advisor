import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";

import {
  Menu,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";


function PageContainer({ children }) {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <div className="mx-auto max-w-[1440px] px-6 py-6">
        {children}
      </div>
    </main>
  );
}

function Surface({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white ${className}`}>
      {children}
    </section>
  );
}


export default function DailyBrief() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const briefDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  return (

    <PageContainer>

      {/* Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 left-6"
        >
          <X size={20} />
        </button>

        <Sidebar />
      </aside>


      {/* Page Content */}
      <div className={`transition-all ${sidebarOpen ? "ml-72" : ""}`}>

        {/* Header */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Sparkles size={16} />
            AI Daily Brief • {briefDate}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Overnight Business Intelligence
          </h1>

          <p className="text-slate-500 mt-2">
            What happened in your business while you slept.
          </p>

        </div>



        <div className="space-y-6">

          {/* AI SUMMARY */}

          <Surface className="p-6 bg-amber-50 border-amber-200">

            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-amber-600" />
              <h2 className="text-lg font-semibold">AI Summary</h2>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Connect your Stripe or product data to receive a nightly
              AI-generated analysis summarizing revenue changes,
              churn signals, and important business events.
            </p>

          </Surface>



          {/* EVENTS + ACTIONS */}

          <div className="grid gap-6 xl:grid-cols-2">

            {/* Key Events */}

            <Surface className="p-6">

              <h2 className="text-lg font-semibold mb-4">
                Key Events (Last 24h)
              </h2>

              <div className="text-sm text-slate-500">
                No activity detected yet.
              </div>

            </Surface>



            {/* Actions */}

            <Surface className="p-6">

              <h2 className="text-lg font-semibold mb-4">
                Actions Required
              </h2>

              <div className="space-y-5">


                {/* Urgent */}

                <div className="flex items-start gap-3">

                  <AlertCircle
                    size={18}
                    className="text-red-600 mt-1"
                  />

                  <div>

                    <p className="font-medium">
                      Urgent
                    </p>

                    <p className="text-sm text-slate-500">
                      No urgent issues detected
                    </p>

                  </div>

                </div>



                {/* Moderate */}

                <div className="flex items-start gap-3">

                  <Clock
                    size={18}
                    className="text-orange-500 mt-1"
                  />

                  <div>

                    <p className="font-medium">
                      Moderate
                    </p>

                    <p className="text-sm text-slate-500">
                      No moderate actions required
                    </p>

                  </div>

                </div>



                {/* Low */}

                <div className="flex items-start gap-3">

                  <CheckCircle
                    size={18}
                    className="text-blue-600 mt-1"
                  />

                  <div>

                    <p className="font-medium">
                      Low Priority
                    </p>

                    <p className="text-sm text-slate-500">
                      No recommendations available
                    </p>

                  </div>

                </div>

              </div>

            </Surface>

          </div>



          {/* FULL REPORT CTA */}

          <Surface className="p-6">

            <div className="flex justify-between items-center">

              <div>

                <h3 className="font-semibold">
                  View detailed AI analysis
                </h3>

                <p className="text-sm text-slate-500">
                  Explore deeper insights and trends detected overnight.
                </p>

              </div>


              <button
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-800 transition"
              >
                Open Report
                <ArrowUpRight size={16} />
              </button>

            </div>

          </Surface>

        </div>

      </div>

    </PageContainer>

  );
}