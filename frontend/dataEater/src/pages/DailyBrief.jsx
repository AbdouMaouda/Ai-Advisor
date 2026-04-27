import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import { useInsights } from "../hooks/useInsights.js";
import { UserButton } from "@clerk/clerk-react";
import {
  Menu, X, Sparkles, AlertCircle, Clock,
  CheckCircle, ArrowUpRight, RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

function Surface({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white ${className}`}>
      {children}
    </section>
  );
}

// ── Skeleton blocks ────────────────────────────────────────────────────────────
function SkeletonLine({ w = "w-full" }) {
  return <div className={`h-3.5 bg-gray-200 rounded animate-pulse ${w}`} />;
}

function SummarySkeleton() {
  return (
    <Surface className="p-6 bg-amber-50 border-amber-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 rounded bg-amber-200 animate-pulse" />
        <div className="h-4 w-24 bg-amber-200 rounded animate-pulse" />
      </div>
      <div className="space-y-2.5">
        <SkeletonLine />
        <SkeletonLine w="w-5/6" />
        <SkeletonLine w="w-4/6" />
      </div>
    </Surface>
  );
}

function EventsSkeleton() {
  return (
    <Surface className="p-6">
      <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLine w="w-3/4" />
              <SkeletonLine w="w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function ActionsSkeleton() {
  return (
    <Surface className="p-6">
      <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-5">
        {["red", "orange", "blue"].map((c) => (
          <div key={c} className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded bg-gray-200 animate-pulse flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLine w="w-1/3" />
              <SkeletonLine w="w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

// ── Error state ────────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Failed to load AI insights.</p>
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

// ── Action row ─────────────────────────────────────────────────────────────────
function ActionRow({ icon: Icon, iconClass, label, items }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className={`${iconClass} mt-0.5 flex-shrink-0`} />
      <div className="min-w-0">
        <p className="font-medium text-sm mb-1">{label}</p>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No {label.toLowerCase()} issues detected</p>
        ) : (
          <ul className="space-y-1">
            {items.map((a, i) => (
              <li key={i} className="text-sm text-slate-600">
                <span className="font-medium">{a.title}</span>
                {a.description && (
                  <span className="text-slate-500"> — {a.description}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function DailyBrief() {
  usePageTitle("Daily Brief | DataEater");
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

  const briefDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const urgentActions   = insights?.actions?.filter((a) => a.priority === "high")   ?? [];
  const moderateActions = insights?.actions?.filter((a) => a.priority === "medium") ?? [];
  const lowActions      = insights?.actions?.filter((a) => a.priority === "low")    ?? [];

  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <div className="mx-auto max-w-[1440px] px-6 py-6">

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="fixed top-6 right-6 z-50">
          <UserButton afterSignOutUrl="/" />
        </div>

        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button onClick={() => setSidebarOpen(false)} className="absolute top-6 left-6">
            <X size={20} />
          </button>
          <Sidebar />
        </aside>

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

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-6">
              <SummarySkeleton />
              <div className="grid gap-6 xl:grid-cols-2">
                <EventsSkeleton />
                <ActionsSkeleton />
              </div>
            </div>
          )}

          {/* No Stripe connected */}
          {!loading && noStripe && (
            <div className="text-center py-20">
              <Sparkles size={40} className="text-amber-300 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-xl font-semibold text-gray-700 mb-2">No insights yet</p>
              <p className="text-gray-500">Connect your Stripe account to unlock AI insights.</p>
            </div>
          )}

          {/* No API key configured */}
          {!loading && !noStripe && !error && apiKeyRequired && (
            <div className="text-center py-20">
              <Sparkles size={40} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
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
          {!loading && !noStripe && !error && apiKeyInvalid && (
            <div className="text-center py-20">
              <Sparkles size={40} className="text-red-300 mx-auto mb-4" strokeWidth={1.5} />
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

          {/* Error state */}
          {!loading && !noStripe && !apiKeyRequired && !apiKeyInvalid && error && <ErrorState onRetry={retry} />}

          {/* Content */}
          {!loading && !noStripe && !apiKeyRequired && !apiKeyInvalid && !error && insights && (
            <div
              className="space-y-6 transition-opacity duration-500"
              style={{ opacity: fadeIn ? 1 : 0 }}
            >

              {/* AI Summary */}
              <Surface className="p-6 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-amber-600" />
                  <h2 className="text-lg font-semibold">AI Summary</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {insights.summary ?? "No summary available for this period."}
                </p>
                {insights.lastUpdated && (
                  <p className="text-xs text-slate-400 mt-3">
                    Last updated: {new Date(insights.lastUpdated).toLocaleString()}
                  </p>
                )}
              </Surface>

              {/* Events + Actions grid */}
              <div className="grid gap-6 xl:grid-cols-2">

                {/* Key Events */}
                <Surface className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Key Events (Last 24h)</h2>
                  {insights.keyEvents?.length > 0 ? (
                    <ul className="space-y-2">
                      {insights.keyEvents.map((e, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-slate-400 flex-shrink-0">•</span>
                          {e}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">No key events detected this period.</p>
                  )}
                </Surface>

                {/* Actions Required */}
                <Surface className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Actions Required</h2>
                  <div className="space-y-5">
                    <ActionRow
                      icon={AlertCircle}
                      iconClass="text-red-600"
                      label="Urgent"
                      items={urgentActions}
                    />
                    <ActionRow
                      icon={Clock}
                      iconClass="text-orange-500"
                      label="Moderate"
                      items={moderateActions}
                    />
                    <ActionRow
                      icon={CheckCircle}
                      iconClass="text-blue-600"
                      label="Low Priority"
                      items={lowActions}
                    />
                  </div>
                </Surface>

              </div>

              {/* CTA */}
              <Surface className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">View detailed AI analysis</h3>
                    <p className="text-sm text-slate-500">
                      Explore deeper insights and trends detected overnight.
                    </p>
                  </div>
                  <Link
                    to="/insights"
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-800 transition"
                  >
                    Open Report
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </Surface>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}
