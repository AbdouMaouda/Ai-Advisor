import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import { useInsights } from "../hooks/useInsights.js";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X, ArrowLeft, AlertCircle, Clock, Target, Zap, RefreshCw, Key } from "lucide-react";
import { Link } from "react-router-dom";

function SkeletonLine({ w = "w-full" }) {
  return <div className={`h-3.5 bg-gray-200 rounded animate-pulse ${w}`} />;
}

function SectionSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2.5">
        <SkeletonLine w="w-5/6" />
        <SkeletonLine w="w-4/6" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
      <p className="text-gray-500 mb-4">Failed to load action items.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

const PRIORITY_CONFIG = {
  urgent:   { icon: AlertCircle, color: "red",    label: "Urgent"       },
  moderate: { icon: Clock,       color: "orange", label: "Moderate"     },
  low:      { icon: Target,      color: "blue",   label: "Low Priority" },
};

const COLOR_CLASSES = {
  red:    "border-red-200 bg-red-50 text-red-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  blue:   "border-blue-200 bg-blue-50 text-blue-700",
};

function ActionSection({ priority, items }) {
  const { icon: Icon, color, label } = PRIORITY_CONFIG[priority];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`${COLOR_CLASSES[color]} p-2 rounded-lg border`} size={28} />
        <h2 className="text-lg font-semibold">{label}</h2>
        {items.length > 0 && (
          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border ${COLOR_CLASSES[color]}`}>
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No {label.toLowerCase()} actions detected.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-snug">{a.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ActionDetails() {
  usePageTitle("Action Items | DataEater");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { insights, loading, error, retry, noStripe, apiKeyRequired, apiKeyInvalid } = useInsights();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!loading && insights) {
      const t = setTimeout(() => setFadeIn(true), 10);
      return () => clearTimeout(t);
    } else {
      setFadeIn(false);
    }
  }, [loading, insights]);

  const urgentItems   = insights?.actions?.filter((a) => a.priority === "urgent")   ?? [];
  const moderateItems = insights?.actions?.filter((a) => a.priority === "moderate") ?? [];
  const lowItems      = insights?.actions?.filter((a) => a.priority === "low")      ?? [];
  const totalActions  = (insights?.actions?.length ?? 0);

  return (
    <div className="min-h-screen bg-stone-50">

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <Menu size={22} />
        </button>
      )}

      <div className="fixed top-6 right-6 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-200"
        >
          <X size={22} />
        </button>
        <Sidebar />
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        <div className="mx-auto max-w-[1440px] px-6 py-10">

          <div className="flex items-center gap-4 mb-10">
            <Link to="/dailybrief" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft size={16} />
              Daily Brief
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-semibold text-gray-900 mb-2">Action Items</h1>
            <p className="text-gray-600 max-w-xl">
              AI-generated recommendations based on your business metrics and performance signals.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">

            {/* Left column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {loading && (
                <>
                  <SectionSkeleton />
                  <SectionSkeleton />
                  <SectionSkeleton />
                </>
              )}

              {!loading && noStripe && (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                  <p className="text-gray-700 font-medium mb-1">No insights yet</p>
                  <p className="text-sm text-gray-500">Connect your Stripe account to unlock AI insights.</p>
                </div>
              )}

              {!loading && !noStripe && !error && apiKeyRequired && (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                  <Key size={36} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-700 font-medium mb-1">AI provider not configured</p>
                  <p className="text-sm text-gray-500 mb-5">Add your API key in Settings to enable action recommendations.</p>
                  <Link
                    to="/settings/api-key"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Configure in Settings
                  </Link>
                </div>
              )}

              {!loading && !noStripe && !error && apiKeyInvalid && (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                  <Key size={36} className="text-red-300 mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-700 font-medium mb-1">Invalid API key</p>
                  <p className="text-sm text-gray-500 mb-5">Your API key is invalid. Please update it in Settings.</p>
                  <Link
                    to="/settings/api-key"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Update in Settings
                  </Link>
                </div>
              )}

              {!loading && !noStripe && !apiKeyRequired && !apiKeyInvalid && error && <ErrorState onRetry={retry} />}

              {!loading && !noStripe && !apiKeyRequired && !apiKeyInvalid && !error && insights && (
                <div
                  className="space-y-6 transition-opacity duration-500"
                  style={{ opacity: fadeIn ? 1 : 0 }}
                >
                  <ActionSection priority="urgent"   items={urgentItems}   />
                  <ActionSection priority="moderate" items={moderateItems} />
                  <ActionSection priority="low"      items={lowItems}      />
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Actions</p>
                    <p className="text-4xl font-semibold">
                      {loading ? (
                        <span className="inline-block w-12 h-9 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        totalActions
                      )}
                    </p>
                  </div>
                  <Zap className="text-amber-500" size={26} />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Urgent</span>
                    <span className="font-medium text-red-600">{loading ? "—" : urgentItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moderate</span>
                    <span className="font-medium text-orange-500">{loading ? "—" : moderateItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Priority</span>
                    <span className="font-medium text-blue-600">{loading ? "—" : lowItems.length}</span>
                  </div>
                </div>
              </div>

              {insights?.lastUpdated && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Last Analysis</p>
                  <p className="text-sm text-gray-700">
                    {new Date(insights.lastUpdated).toLocaleString()}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
