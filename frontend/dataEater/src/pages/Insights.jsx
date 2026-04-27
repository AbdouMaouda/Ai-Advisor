import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import { useInsights } from "../hooks/useInsights.js";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X, Sparkles, Brain, RefreshCw, TrendingUp, AlertTriangle, Key } from "lucide-react";
import { Link } from "react-router-dom";

function SkeletonLine({ w = "w-full", h = "h-3.5" }) {
  return <div className={`${h} ${w} bg-gray-200 rounded animate-pulse`} />;
}

function StatSkeleton() {
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="px-8 lg:px-12 py-6">
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-2.5 w-20 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-8 w-16 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <SkeletonLine w="w-1/2" h="h-4" />
      </div>
      <SkeletonLine />
      <SkeletonLine w="w-5/6" />
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-20">
      <Brain size={40} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
      <p className="text-gray-600 mb-6">Failed to load AI insights.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

function InsightCard({ number, title, description, badge, badgeColor }) {
  const colors = {
    green:  "bg-green-50 text-green-700 border-green-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{number}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        {badge && (
          <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${colors[badgeColor] ?? colors.blue}`}>
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed pl-11">{description}</p>
      )}
    </div>
  );
}

export default function Insights() {
  usePageTitle("Insights | DataEater");
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

  const opportunityCount  = insights?.opportunities?.length ?? 0;
  const riskCount         = insights?.risks?.length ?? 0;
  const actionCount       = insights?.actions?.length ?? 0;

  return (
    <div className="min-h-screen bg-white">

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-white border border-gray-200"
          aria-label="Open sidebar"
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
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-200 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
        <Sidebar />
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>

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

        {/* Stats row */}
        {loading && !noStripe ? (
          <StatSkeleton />
        ) : (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="px-8 lg:px-12 py-6">
              <div className="grid grid-cols-4 gap-8">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Total Insights</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {error || noStripe || apiKeyRequired || apiKeyInvalid ? "—" : opportunityCount + riskCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Opportunities</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {error || noStripe || apiKeyRequired || apiKeyInvalid ? "—" : opportunityCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Risks</p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {error || noStripe || apiKeyRequired || apiKeyInvalid ? "—" : riskCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Last Updated</p>
                  <p className="text-3xl font-semibold text-gray-400">
                    {insights?.lastUpdated
                      ? new Date(insights.lastUpdated).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="px-8 lg:px-12 py-12">
          <div className="max-w-3xl mx-auto">

            {/* No Stripe connected */}
            {noStripe && (
              <div className="text-center py-20">
                <Brain size={40} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-xl font-semibold text-gray-700 mb-2">No insights yet</p>
                <p className="text-gray-500">Connect your Stripe account to unlock AI insights.</p>
              </div>
            )}

            {/* Loading skeletons */}
            {!noStripe && loading && (
              <div className="space-y-4">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-6" />
                {[1, 2, 3].map((i) => <InsightCardSkeleton key={i} />)}
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-8 mb-4" />
                {[1, 2].map((i) => <InsightCardSkeleton key={i} />)}
              </div>
            )}

            {/* No API key configured */}
            {!noStripe && !loading && !error && apiKeyRequired && (
              <div className="text-center py-20">
                <Key size={40} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-xl font-semibold text-gray-700 mb-2">AI provider not configured</p>
                <p className="text-gray-500 mb-6">Add your API key in Settings to enable AI insights.</p>
                <Link
                  to="/settings/api-key"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Configure in Settings
                </Link>
              </div>
            )}

            {/* Invalid API key */}
            {!noStripe && !loading && !error && apiKeyInvalid && (
              <div className="text-center py-20">
                <Key size={40} className="text-red-300 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-xl font-semibold text-gray-700 mb-2">Invalid API key</p>
                <p className="text-gray-500 mb-6">Your API key is invalid. Please update it in Settings.</p>
                <Link
                  to="/settings/api-key"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Update in Settings
                </Link>
              </div>
            )}

            {/* Error */}
            {!noStripe && !loading && !apiKeyRequired && !apiKeyInvalid && error && <ErrorState onRetry={retry} />}

            {/* Content */}
            {!noStripe && !loading && !apiKeyRequired && !apiKeyInvalid && !error && insights && (
              <div
                className="transition-opacity duration-500"
                style={{ opacity: fadeIn ? 1 : 0 }}
              >
                {/* Opportunities */}
                {insights.opportunities?.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <TrendingUp size={18} className="text-green-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
                    </div>
                    <div className="space-y-3">
                      {insights.opportunities.map((opp, i) => (
                        <InsightCard key={i} number={i + 1} title={opp} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {insights.risks?.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <AlertTriangle size={18} className="text-red-500" />
                      <h2 className="text-lg font-semibold text-gray-900">Risks</h2>
                    </div>
                    <div className="space-y-3">
                      {insights.risks.map((risk, i) => (
                        <InsightCard key={i} number={i + 1} title={risk} badgeColor="red" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state — no data yet */}
                {insights.opportunities?.length === 0 && insights.risks?.length === 0 && (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <Brain size={40} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Insights Yet</h2>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      Your data is connected — insights will appear once metrics have been calculated.
                    </p>
                  </div>
                )}

                {/* Summary card */}
                {insights.summary && (
                  <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-4">
                      <Sparkles size={20} className="text-gray-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Summary</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{insights.summary}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
