import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import { useApiClient } from "../api/client.js";
import { UserButton } from "@clerk/clerk-react";
import {
  Menu, X, Sparkles, TrendingUp, TrendingDown, AlertCircle,
  Lightbulb, ChevronDown, ChevronUp, ArrowLeft, Calendar,
  Download, Share2, DollarSign, Users, CreditCard, Target, Zap
} from "lucide-react";

const fmtCurrency = (n) => {
  if (n == null) return "—";
  return "$" + parseFloat(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
};
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
const fmtPct = (n) => (n == null ? "—" : parseFloat(n).toFixed(2) + "%");

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default function FullReport() {
  usePageTitle("Full Insights | DataEater");
  const api = useApiClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [sectionLoading, setSectionLoading] = useState({});

  const reportDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const fetchSectionData = async (sectionId) => {
    if (sectionData[sectionId] || sectionLoading[sectionId]) return;
    setSectionLoading((prev) => ({ ...prev, [sectionId]: true }));
    try {
      const period = "months=3";
      let data;
      if (sectionId === "revenue") {
        const [rev, inv] = await Promise.all([
          api.get("/api/v1/revenueBusiness?" + period),
          api.get("/api/v1/invoiceBusiness?" + period),
        ]);
        data = { revenue: rev, invoices: inv };
      } else if (sectionId === "customers") {
        data = await api.get("/api/v1/customersBusiness?" + period);
      } else if (sectionId === "subscriptions") {
        data = await api.get("/api/v1/subscriptionBusiness?" + period);
      } else if (sectionId === "refunds") {
        data = await api.get("/api/v1/refundBusiness?" + period);
      }
      setSectionData((prev) => ({ ...prev, [sectionId]: data }));
    } catch (e) {
      console.error(`Failed to load ${sectionId}`, e);
    } finally {
      setSectionLoading((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const toggleSection = (sectionId) => {
    const isExpanding = !expandedSections.includes(sectionId);
    if (isExpanding) fetchSectionData(sectionId);
    setExpandedSections((prev) =>
      isExpanding ? [...prev, sectionId] : prev.filter((id) => id !== sectionId)
    );
  };

  const isOpen = (id) => expandedSections.includes(id);
  const isLoading = (id) => sectionLoading[id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-3 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all"
          aria-label="Open sidebar"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
      )}

      <div className="fixed top-6 right-6 z-50">
        <UserButton afterSignOutUrl="/" />
      </div>

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50 border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-40 ${
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

      <main className={`relative z-10 p-8 lg:p-12 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <button className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all">
              <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span className="font-semibold">Back to Daily Brief</span>
            </button>

            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-full">
                      <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={14} />
                        AI Full Report
                      </span>
                    </div>
                  </div>
                  <h1 className="text-5xl font-black text-gray-900 mb-2">Detailed Analysis</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <p className="text-lg font-medium">{reportDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all font-semibold text-gray-700" disabled>
                  <Share2 size={20} />
                  Share
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all font-semibold" disabled>
                  <Download size={20} />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white border-2 border-purple-200 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Sparkles className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Executive Summary</h2>
                  <p className="text-sm text-gray-600">AI-generated overview of your business</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                <p className="text-gray-600 text-lg leading-relaxed text-center py-8">
                  No data available. Connect your data sources to generate your comprehensive AI-powered business report.
                </p>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-emerald-300 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white border-2 border-cyan-200 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl shadow-lg">
                  <Target className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Business Health Score</h2>
                  <p className="text-sm text-gray-600">Overall performance indicator</p>
                </div>
              </div>
              <div className="text-center py-12">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-black text-gray-300">—</div>
                      <div className="text-sm text-gray-500 font-semibold mt-2">/100</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 font-medium">Connect data sources to see your score</p>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">

            {/* Revenue Analysis */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleSection("revenue")}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                      <DollarSign className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Revenue Analysis</h3>
                      <p className="text-sm text-gray-600">Income trends, forecasts, and insights (last 3 months)</p>
                    </div>
                  </div>
                  {isOpen("revenue") ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                </button>

                {isOpen("revenue") && (
                  <div className="px-6 pb-6">
                    {isLoading("revenue") ? (
                      <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                    ) : sectionData.revenue ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">Revenue</p>
                          <MetricRow label="Gross Revenue" value={fmtCurrency(sectionData.revenue.revenue?.grossRevenue)} />
                          <MetricRow label="Net Revenue" value={fmtCurrency(sectionData.revenue.revenue?.netRevenue)} />
                          <MetricRow label="Avg Daily Revenue" value={fmtCurrency(sectionData.revenue.revenue?.averageDailyRevenue)} />
                          <MetricRow label="Avg Transaction" value={fmtCurrency(sectionData.revenue.revenue?.averageTransactionValue)} />
                          <MetricRow label="Successful Charges" value={fmtNum(sectionData.revenue.revenue?.successfulCharges)} />
                          <MetricRow label="Failed Charges" value={fmtNum(sectionData.revenue.revenue?.failedCharges)} />
                        </div>
                        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                          <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-3">Invoices</p>
                          <MetricRow label="Total Invoices" value={fmtNum(sectionData.revenue.invoices?.totalInvoices)} />
                          <MetricRow label="Paid" value={fmtNum(sectionData.revenue.invoices?.paidInvoices)} />
                          <MetricRow label="Unpaid" value={fmtNum(sectionData.revenue.invoices?.unpaidInvoices)} />
                          <MetricRow label="Overdue" value={fmtNum(sectionData.revenue.invoices?.overdueInvoices)} />
                          <MetricRow label="Total Invoiced" value={fmtCurrency(sectionData.revenue.invoices?.totalInvoiced)} />
                          <MetricRow label="Outstanding" value={fmtCurrency(sectionData.revenue.invoices?.totalOutstanding)} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 text-center border-2 border-emerald-100">
                        <TrendingUp className="text-emerald-300 mx-auto mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No revenue data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Insights */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleSection("customers")}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <Users className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Customer Insights</h3>
                      <p className="text-sm text-gray-600">Behavior, retention, and segmentation (last 3 months)</p>
                    </div>
                  </div>
                  {isOpen("customers") ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                </button>

                {isOpen("customers") && (
                  <div className="px-6 pb-6">
                    {isLoading("customers") ? (
                      <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                    ) : sectionData.customers ? (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <MetricRow label="Total Customers" value={fmtNum(sectionData.customers.totalCustomers)} />
                        <MetricRow label="New Customers" value={fmtNum(sectionData.customers.newCustomers)} />
                        <MetricRow label="Active Customers" value={fmtNum(sectionData.customers.activeCustomers)} />
                        <MetricRow label="Churned Customers" value={fmtNum(sectionData.customers.churnedCustomers)} />
                        <MetricRow label="Avg Customer Value" value={fmtCurrency(sectionData.customers.averageCustomerValue)} />
                        <MetricRow label="Avg Lifetime Value" value={fmtCurrency(sectionData.customers.averageCustomerLifetimeValue)} />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 text-center border-2 border-blue-100">
                        <Users className="text-blue-300 mx-auto mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No customer data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Growth Opportunities */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white border-2 border-yellow-200 rounded-2xl overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleSection("subscriptions")}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-yellow-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl shadow-lg">
                      <Lightbulb className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Growth Opportunities</h3>
                      <p className="text-sm text-gray-600">Subscription trends and recurring revenue (last 3 months)</p>
                    </div>
                  </div>
                  {isOpen("subscriptions") ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                </button>

                {isOpen("subscriptions") && (
                  <div className="px-6 pb-6">
                    {isLoading("subscriptions") ? (
                      <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                    ) : sectionData.subscriptions ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">Recurring Revenue</p>
                          <MetricRow label="MRR" value={fmtCurrency(sectionData.subscriptions.mrr)} />
                          <MetricRow label="ARR" value={fmtCurrency(sectionData.subscriptions.arr)} />
                          <MetricRow label="Avg Revenue / Sub" value={fmtCurrency(sectionData.subscriptions.averageRevenuePerSubscription)} />
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">Subscription Counts</p>
                          <MetricRow label="Active" value={fmtNum(sectionData.subscriptions.activeSubscriptions)} />
                          <MetricRow label="Trialing" value={fmtNum(sectionData.subscriptions.trialingSubscriptions)} />
                          <MetricRow label="New" value={fmtNum(sectionData.subscriptions.newSubscriptions)} />
                          <MetricRow label="Canceled" value={fmtNum(sectionData.subscriptions.canceledSubscriptions)} />
                          <MetricRow label="Upgrades" value={fmtNum(sectionData.subscriptions.upgrades)} />
                          <MetricRow label="Downgrades" value={fmtNum(sectionData.subscriptions.downgrades)} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8 text-center border-2 border-yellow-100">
                        <Lightbulb className="text-yellow-300 mx-auto mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No subscription data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Risks & Alerts */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-300 to-orange-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-lg">
                <button
                  onClick={() => toggleSection("refunds")}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-red-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg">
                      <AlertCircle className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Risks & Alerts</h3>
                      <p className="text-sm text-gray-600">Refund trends and potential issues (last 3 months)</p>
                    </div>
                  </div>
                  {isOpen("refunds") ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
                </button>

                {isOpen("refunds") && (
                  <div className="px-6 pb-6">
                    {isLoading("refunds") ? (
                      <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
                    ) : sectionData.refunds ? (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <MetricRow label="Total Refunds" value={fmtNum(sectionData.refunds.totalRefunds)} />
                        <MetricRow label="Total Refund Amount" value={fmtCurrency(sectionData.refunds.totalRefundAmount)} />
                        <MetricRow label="Full Refunds" value={fmtNum(sectionData.refunds.fullRefunds)} />
                        <MetricRow label="Partial Refunds" value={fmtNum(sectionData.refunds.partialRefunds)} />
                        <MetricRow label="Avg Refund Amount" value={fmtCurrency(sectionData.refunds.averageRefundAmount)} />
                        <MetricRow label="Refund Rate" value={fmtPct(sectionData.refunds.refundRate)} />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 text-center border-2 border-red-100">
                        <AlertCircle className="text-red-300 mx-auto mb-3" size={48} />
                        <p className="text-gray-500 font-medium">No refund data available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Predictions — requires AI endpoint, kept disabled */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white border-2 border-purple-200 rounded-2xl overflow-hidden shadow-lg">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
                  disabled
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                      <Zap className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Predictions & Forecasts</h3>
                      <p className="text-sm text-gray-600">AI-powered future projections — coming soon</p>
                    </div>
                  </div>
                  <ChevronDown size={24} className="text-gray-400" />
                </button>
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 text-center border-2 border-purple-100">
                    <Zap className="text-purple-300 mx-auto mb-3" size={48} />
                    <p className="text-gray-500 font-medium">No predictions available</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-emerald-300 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-cyan-50 to-emerald-50 border-2 border-cyan-200 rounded-3xl p-10 text-center">
              <h3 className="text-3xl font-black text-gray-900 mb-4">Ready to Get Insights?</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Connect your data sources to unlock comprehensive AI-powered analysis, predictions, and personalized recommendations.
              </p>
              <button className="group/cta relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 animate-gradient-x"></div>
                <span className="relative text-white flex items-center gap-3">
                  <Sparkles size={24} className="group-hover/cta:rotate-180 transition-transform duration-500" />
                  Connect Data Sources
                  <ArrowLeft size={24} className="rotate-180 group-hover/cta:translate-x-2 transition-transform" />
                </span>
              </button>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
