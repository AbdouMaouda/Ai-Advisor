import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStripe } from "../contexts/StripeContext.jsx";
import Sidebar from "../components/sidebar.jsx";
import { useApiClient } from "../api/client.js";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import {
  Menu, X, TrendingUp, TrendingDown, DollarSign, Users,
  CreditCard, Activity, Calendar, Filter, Download, FileText
} from "lucide-react";

const fmtCurrency = (n) => {
  if (n == null) return "—";
  return "$" + parseFloat(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
};
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
const fmtPct = (n) => (n == null ? "—" : parseFloat(n).toFixed(1) + "%");

const ENDPOINT_MAP = {
  revenue:       "revenueBusiness",
  customers:     "customersBusiness",
  subscriptions: "subscriptionBusiness",
  invoices:      "invoiceBusiness",
};

function getMetricUrl(metricId, range) {
  const param = range === "weekly" ? "weeks=1" : "months=1";
  return "/api/v1/" + ENDPOINT_MAP[metricId] + "?" + param;
}

const DEMO_SNAPSHOT = {
  revenueMetrics: {
    grossRevenue: 47832, netRevenue: 44100,
    successfulCharges: 491, failedCharges: 9,
    refundedAmount: 3732, averageDailyRevenue: 1565,
    averageTransactionValue: 97.4,
  },
  customerMetrics: {
    totalCustomers: 127, activeCustomers: 127,
    newCustomers: 23, churnedCustomers: 2,
    averageCustomerLifetimeValue: 1840, averageCustomerValue: 376,
  },
  subscriptionMetrics: {
    activeSubscriptions: 127, newSubscriptions: 23,
    canceledSubscriptions: 2, mrr: 12450, arr: 149400,
    averageRevenuePerSubscription: 98, trialingSubscriptions: 8,
  },
  invoiceMetrics: {
    totalInvoices: 312, paidInvoices: 298, unpaidInvoices: 14,
    overdueInvoices: 3, totalPaid: 44100, totalOutstanding: 1850,
    averageDaysToPayment: 4,
  },
  healthMetrics: { healthScore: 87 },
};

const DEMO_MD = {
  grossRevenue: 47832, netRevenue: 44100,
  successfulCharges: 491, failedCharges: 9,
  refundedAmount: 3732, averageDailyRevenue: 1565,
  averageTransactionValue: 97.4,
  totalCustomers: 127, activeCustomers: 127,
  newCustomers: 23, churnedCustomers: 2,
  averageCustomerLifetimeValue: 1840, averageCustomerValue: 376,
  activeSubscriptions: 127, newSubscriptions: 23,
  canceledSubscriptions: 2, mrr: 12450, arr: 149400,
  averageRevenuePerSubscription: 98, trialingSubscriptions: 8,
  totalInvoices: 312, paidInvoices: 298, unpaidInvoices: 14,
  overdueInvoices: 3, totalPaid: 44100, totalOutstanding: 1850,
  averageDaysToPayment: 4,
};

const DEMO_HISTORY = [
  { endDate: "Nov 3",  revenueMetrics: { grossRevenue: 8200  }, customerMetrics: { newCustomers: 4 }, subscriptionMetrics: { activeSubscriptions: 104 }, invoiceMetrics: { unpaidInvoices: 3 } },
  { endDate: "Nov 10", revenueMetrics: { grossRevenue: 9800  }, customerMetrics: { newCustomers: 6 }, subscriptionMetrics: { activeSubscriptions: 108 }, invoiceMetrics: { unpaidInvoices: 2 } },
  { endDate: "Nov 17", revenueMetrics: { grossRevenue: 11200 }, customerMetrics: { newCustomers: 5 }, subscriptionMetrics: { activeSubscriptions: 112 }, invoiceMetrics: { unpaidInvoices: 4 } },
  { endDate: "Nov 24", revenueMetrics: { grossRevenue: 10500 }, customerMetrics: { newCustomers: 4 }, subscriptionMetrics: { activeSubscriptions: 118 }, invoiceMetrics: { unpaidInvoices: 2 } },
  { endDate: "Dec 1",  revenueMetrics: { grossRevenue: 12800 }, customerMetrics: { newCustomers: 7 }, subscriptionMetrics: { activeSubscriptions: 121 }, invoiceMetrics: { unpaidInvoices: 3 } },
  { endDate: "Dec 8",  revenueMetrics: { grossRevenue: 13600 }, customerMetrics: { newCustomers: 8 }, subscriptionMetrics: { activeSubscriptions: 124 }, invoiceMetrics: { unpaidInvoices: 1 } },
  { endDate: "Dec 15", revenueMetrics: { grossRevenue: 14200 }, customerMetrics: { newCustomers: 9 }, subscriptionMetrics: { activeSubscriptions: 127 }, invoiceMetrics: { unpaidInvoices: 2 } },
];

export default function Dashboard() {
  usePageTitle("Dashboard | DataEater");
  const { isLoaded, isSignedIn } = useAuth();
  const api = useApiClient();
  const { stripeConnected, refetchStripe } = useStripe();
  const isDemo = stripeConnected !== true;
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [timeRange, setTimeRange] = useState("weekly");
  const [snapshot, setSnapshot] = useState(null);
  const [metricData, setMetricData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing snapshots from DB on load — no calculation triggered here
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    Promise.all([
      api.get("/api/v1/metrics/latest"),
      api.get("/api/v1/metrics/history"),
      api.get(getMetricUrl("revenue", "weekly")),
    ])
      .then(([snap, hist, revData]) => {
        setSnapshot(snap);
        setHistory(Array.isArray(hist) ? hist : []);
        setMetricData(revData);
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  // Stripe OAuth redirect: clear the URL param and refresh stripe status in context
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const params = new URLSearchParams(location.search);
    if (!params.has("stripe_connected")) return;

    navigate("/dashboard", { replace: true });
    refetchStripe();
  }, [isLoaded, isSignedIn, location.search]);

  const handleTimeRange = (range) => {
    if (range === timeRange) return;
    setTimeRange(range);

    const periodUrl = range === "weekly"
      ? "/api/v1/metrics/period?weeks=1"
      : "/api/v1/metrics/period?months=1";

    api.get(periodUrl)
      .then((data) => { if (data) setSnapshot(data); });

    const metricUrl = getMetricUrl(selectedMetric, range);
    api.get(metricUrl)
      .then((data) => { setMetricData(data); });
  };

  const handleStripeConnect = async () => {
    try {
      console.log("Stripe connect clicked");
      const data = await api.post("/api/stripe/create-account-link");
      console.log("Stripe connect response:", data);
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Stripe connect error:", err);
    }
  };

  const handleMetricSelect = (metricId) => {
    if (metricId === selectedMetric) return;
    setSelectedMetric(metricId);
    const url = getMetricUrl(metricId, timeRange);
    api.get(url).then((data) => { setMetricData(data); });
  };

  // Summary card + sidebar driven by latest snapshot (or demo data)
  const effectiveSnapshot = isDemo ? DEMO_SNAPSHOT : snapshot;
  const rev    = effectiveSnapshot?.revenueMetrics;
  const cust   = effectiveSnapshot?.customerMetrics;
  const sub    = effectiveSnapshot?.subscriptionMetrics;
  const health = effectiveSnapshot?.healthMetrics;

  const totalCust   = Number(cust?.totalCustomers ?? 0);
  const churnedCust = Number(cust?.churnedCustomers ?? 0);
  const retentionRate = totalCust > 0
    ? fmtPct(((totalCust - churnedCust) / totalCust) * 100) : "—";

  const successful = Number(rev?.successfulCharges ?? 0);
  const failed     = Number(rev?.failedCharges ?? 0);
  const paymentSuccess = (successful + failed) > 0
    ? fmtPct((successful / (successful + failed)) * 100) : "—";

  const weeklyAvg = rev?.averageDailyRevenue != null
    ? fmtCurrency(parseFloat(rev.averageDailyRevenue) * 7) : "—";

  const healthScore = health?.healthScore != null
    ? Math.round(parseFloat(health.healthScore)) : null;

  // Chart
  const chartMetricMap = {
    revenue:       { key: "grossRevenue",        label: "Revenue ($)",     color: "#f97316" },
    customers:     { key: "newCustomers",         label: "New Customers",   color: "#3b82f6" },
    subscriptions: { key: "activeSubscriptions",  label: "Active Subs",     color: "#10b981" },
    invoices:      { key: "unpaidInvoices",       label: "Unpaid Invoices", color: "#8b5cf6" },
  };
  const activeChart = chartMetricMap[selectedMetric];

  const chartData = [...(isDemo ? DEMO_HISTORY : history)]
    .sort((a, b) => (a.endDate > b.endDate ? 1 : -1))
    .map((snap) => ({
      date:                snap.endDate,
      grossRevenue:        parseFloat(snap.revenueMetrics?.grossRevenue ?? 0),
      newCustomers:        Number(snap.customerMetrics?.newCustomers ?? 0),
      activeSubscriptions: Number(snap.subscriptionMetrics?.activeSubscriptions ?? 0),
      unpaidInvoices:      Number(snap.invoiceMetrics?.unpaidInvoices ?? 0),
    }));

  const timeLabel = timeRange === "weekly" ? "This Week" : "This Month";

  // Metric card data derives from the live-fetched metricData (or demo data)
  const md = isDemo ? DEMO_MD : metricData;

  // Payment success from live revenue data
  const mdSuccessful = Number(md?.successfulCharges ?? 0);
  const mdFailed     = Number(md?.failedCharges ?? 0);
  const mdPaySuccess = (mdSuccessful + mdFailed) > 0
    ? fmtPct((mdSuccessful / (mdSuccessful + mdFailed)) * 100) : "—";

  // Churn rate from live customer data
  const mdTotal   = Number(md?.totalCustomers ?? 0);
  const mdChurned = Number(md?.churnedCustomers ?? 0);
  const mdChurnRate = mdTotal > 0 ? fmtPct((mdChurned / mdTotal) * 100) : "—";

  const metrics = [
    { id: "revenue",       label: "Revenue",       icon: DollarSign },
    { id: "customers",     label: "Customers",     icon: Users      },
    { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { id: "invoices",      label: "Invoices",      icon: FileText   },
  ];

  // ── Reusable card shells ──────────────────────────────────────────────────
  const LightCard = ({ icon: Icon, badge, label, value, sub, hasData }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-orange-50 rounded-xl">
          <Icon size={22} className="text-orange-600" />
        </div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{badge}</div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">{label}</p>
        <span className={`text-4xl font-bold ${hasData ? "text-gray-900" : "text-gray-400"}`}>{value}</span>
      </div>
      <div className="h-16 flex items-center justify-center bg-gray-50 rounded-lg">
        <span className={`text-xs font-medium ${hasData ? "text-gray-500" : "text-gray-400"}`}>{sub}</span>
      </div>
    </div>
  );

  const DarkCard = ({ icon: Icon, badge, label, value, sub, hasData }) => (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-white/10 rounded-xl">
          <Icon size={22} className="text-white" />
        </div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{badge}</div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-300 mb-2">{label}</p>
        <span className={`text-4xl font-bold ${hasData ? "text-white" : "text-gray-500"}`}>{value}</span>
      </div>
      <div className="h-16 flex items-center justify-center bg-white/5 rounded-lg">
        <span className={`text-xs font-medium ${hasData ? "text-gray-400" : "text-gray-500"}`}>{sub}</span>
      </div>
    </div>
  );

  const renderMetricCards = () => {
    if (selectedMetric === "revenue") {
      return (
        <>
          <LightCard icon={DollarSign} badge={timeLabel} label="Gross Revenue"
            value={fmtCurrency(md?.grossRevenue)} hasData={md?.grossRevenue != null}
            sub={md ? fmtNum(md.successfulCharges) + " successful charges" : "No activity"} />
          <LightCard icon={TrendingUp} badge={timeLabel} label="Net Revenue"
            value={fmtCurrency(md?.netRevenue)} hasData={md?.netRevenue != null}
            sub={md ? "after " + fmtCurrency(md.refundedAmount) + " in refunds" : "No activity"} />
          <LightCard icon={Activity} badge="Per charge" label="Avg Transaction"
            value={fmtCurrency(md?.averageTransactionValue)} hasData={md?.averageTransactionValue != null}
            sub={md ? fmtCurrency(md.averageDailyRevenue) + " / day avg" : "No activity"} />
          <DarkCard icon={TrendingUp} badge={timeLabel} label="Payment Success"
            value={mdPaySuccess} hasData={(mdSuccessful + mdFailed) > 0}
            sub={md ? fmtNum(mdFailed) + " failed charges" : "No activity"} />
        </>
      );
    }

    if (selectedMetric === "customers") {
      return (
        <>
          <LightCard icon={Users} badge={timeLabel} label="New Customers"
            value={fmtNum(md?.newCustomers)} hasData={md?.newCustomers != null}
            sub={md ? fmtNum(md.totalCustomers) + " total customers" : "No activity"} />
          <LightCard icon={Users} badge={timeLabel} label="Active Customers"
            value={fmtNum(md?.activeCustomers)} hasData={md?.activeCustomers != null}
            sub={md ? fmtNum(md.newCustomers) + " new this period" : "No activity"} />
          <LightCard icon={TrendingDown} badge={timeLabel} label="Churned Customers"
            value={fmtNum(md?.churnedCustomers)} hasData={md?.churnedCustomers != null}
            sub={md ? "Churn rate: " + mdChurnRate : "No activity"} />
          <DarkCard icon={Users} badge="Avg" label="Customer LTV"
            value={parseFloat(md?.averageCustomerLifetimeValue) > 0 ? fmtCurrency(md.averageCustomerLifetimeValue) : "—"}
            hasData={parseFloat(md?.averageCustomerLifetimeValue) > 0}
            sub={md ? "Avg value: " + fmtCurrency(md.averageCustomerValue) : "No activity"} />
        </>
      );
    }

    if (selectedMetric === "subscriptions") {
      return (
        <>
          <LightCard icon={CreditCard} badge="Active" label="Active Subscriptions"
            value={fmtNum(md?.activeSubscriptions)} hasData={md?.activeSubscriptions != null}
            sub={md ? fmtNum(md.newSubscriptions) + " new this period" : "No activity"} />
          <LightCard icon={TrendingUp} badge={timeLabel} label="New Subscriptions"
            value={fmtNum(md?.newSubscriptions)} hasData={md?.newSubscriptions != null}
            sub={md ? fmtNum(md.canceledSubscriptions) + " canceled" : "No activity"} />
          <LightCard icon={DollarSign} badge="Monthly" label="MRR"
            value={fmtCurrency(md?.mrr)} hasData={md?.mrr != null}
            sub={md ? fmtCurrency(md.averageRevenuePerSubscription) + " / sub avg" : "No activity"} />
          <DarkCard icon={TrendingUp} badge="Annual" label="ARR"
            value={fmtCurrency(md?.arr)} hasData={md?.arr != null}
            sub={md ? fmtNum(md.trialingSubscriptions) + " trialing" : "No activity"} />
        </>
      );
    }

    // invoices
    return (
      <>
        <LightCard icon={FileText} badge={timeLabel} label="Total Invoices"
          value={fmtNum(md?.totalInvoices)} hasData={md?.totalInvoices != null}
          sub={md ? fmtNum(md.paidInvoices) + " paid" : "No activity"} />
        <LightCard icon={FileText} badge={timeLabel} label="Paid Invoices"
          value={fmtNum(md?.paidInvoices)} hasData={md?.paidInvoices != null}
          sub={md ? fmtCurrency(md.totalPaid) + " collected" : "No activity"} />
        <LightCard icon={FileText} badge="Unpaid" label="Unpaid Invoices"
          value={fmtNum(md?.unpaidInvoices)} hasData={md?.unpaidInvoices != null}
          sub={md ? fmtNum(md.overdueInvoices) + " overdue" : "No activity"} />
        <DarkCard icon={DollarSign} badge="Outstanding" label="Amount Due"
          value={fmtCurrency(md?.totalOutstanding)} hasData={md?.totalOutstanding != null}
          sub={md ? "Avg " + fmtNum(md.averageDaysToPayment) + " days to pay" : "No activity"} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-white transition-colors bg-white shadow-sm border border-gray-200"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
        <Sidebar />
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>

        {/* Top Nav */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Activity
                </button>
                <button className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Reports
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={18} className="text-gray-600" />
              </button>
              {stripeConnected !== true && (
                <button onClick={handleStripeConnect} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
                  Connect Data
                </button>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {isDemo && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-3 flex items-center justify-between">
            <p className="text-sm text-amber-800 font-medium">
              You're viewing demo data. Connect your Stripe account to see your real metrics.
            </p>
            <button
              onClick={handleStripeConnect}
              className="ml-6 px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors flex-shrink-0"
            >
              Connect Stripe
            </button>
          </div>
        )}

        <div className="px-8 py-8 relative">

          {/* Floating Vertical Metric Selector */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-[28px] shadow-lg p-2.5 flex flex-col gap-2">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const isActive = selectedMetric === metric.id;
                return (
                  <button
                    key={metric.id}
                    onClick={() => handleMetricSelect(metric.id)}
                    className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-orange-500 shadow-md"
                        : "hover:bg-gray-50"
                    }`}
                    title={metric.label}
                  >
                    <Icon
                      size={24}
                      className={isActive ? "text-white" : "text-gray-500"}
                      strokeWidth={1.5}
                    />
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                      {metric.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto pl-24">

            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Business Overview</h2>
              <p className="text-lg text-gray-600">Monitor your revenue, customers, and key metrics</p>
            </div>

            <div className="grid grid-cols-12 gap-6">

              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">

                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">Performance Summary</p>
                      <p className="text-xs text-gray-500">Track your business metrics</p>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => handleTimeRange("weekly")}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${
                          timeRange === "weekly"
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        onClick={() => handleTimeRange("monthly")}
                        className={`px-4 py-2 text-sm font-semibold transition-colors ${
                          timeRange === "monthly"
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <DollarSign size={16} className="text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Revenue</p>
                      </div>
                      <p className={`text-5xl font-bold mb-2 ${rev?.grossRevenue != null ? "text-gray-900" : "text-gray-400"}`}>
                        {fmtCurrency(rev?.grossRevenue)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {rev?.grossRevenue != null
                          ? fmtNum(rev.successfulCharges) + " successful charges"
                          : "No data available"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <TrendingUp size={16} className="text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Monthly Recurring Revenue</p>
                      </div>
                      <p className={`text-5xl font-bold mb-2 ${snapshot?.subscriptionMetrics?.mrr != null ? "text-gray-900" : "text-gray-400"}`}>
                        {fmtCurrency(snapshot?.subscriptionMetrics?.mrr)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {snapshot?.subscriptionMetrics?.arr != null
                          ? "ARR: " + fmtCurrency(snapshot.subscriptionMetrics.arr)
                          : "No data available"}
                      </p>
                    </div>
                  </div>

                  {chartData.length > 0 ? (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) =>
                              selectedMetric === "revenue"
                                ? "$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v)
                                : v
                            }
                            width={48}
                          />
                          <Tooltip
                            formatter={(value) => [
                              selectedMetric === "revenue" ? fmtCurrency(value) : fmtNum(value),
                              activeChart.label,
                            ]}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey={activeChart.key}
                            stroke={activeChart.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: activeChart.color }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="text-center">
                        <Activity size={40} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-gray-600 mb-1">No history yet</p>
                        <p className="text-xs text-gray-500">Historical trend will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metric Cards — driven by the vertical icon selector */}
                <div className="grid grid-cols-2 gap-6">
                  {renderMetricCards()}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                      <p className="text-xs text-gray-500 mt-1">Latest transactions and events</p>
                    </div>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Filter size={18} className="text-gray-600" />
                    </button>
                  </div>
                  {(isDemo || stripeConnected) ? (
                    <div className="divide-y divide-gray-100">
                      {[
                        {
                          icon: DollarSign,
                          label: "Successful charges",
                          value: fmtNum(md?.successfulCharges ?? snapshot?.revenueMetrics?.successfulCharges),
                          sub: "this period",
                        },
                        {
                          icon: TrendingDown,
                          label: "Failed charges",
                          value: fmtNum(md?.failedCharges ?? snapshot?.revenueMetrics?.failedCharges),
                          sub: "this period",
                        },
                        {
                          icon: Users,
                          label: "New customers",
                          value: fmtNum(md?.newCustomers ?? snapshot?.customerMetrics?.newCustomers),
                          sub: "this period",
                        },
                        {
                          icon: FileText,
                          label: "Paid invoices",
                          value: fmtNum(md?.paidInvoices ?? snapshot?.invoiceMetrics?.paidInvoices),
                          sub: "this period",
                        },
                        {
                          icon: CreditCard,
                          label: "Active subscriptions",
                          value: fmtNum(md?.activeSubscriptions ?? snapshot?.subscriptionMetrics?.activeSubscriptions),
                          sub: "total",
                        },
                      ].map(({ icon: Icon, label, value, sub }) => (
                        <div key={label} className="flex items-center gap-4 px-6 py-4">
                          <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
                            <Icon size={16} className="text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500">{sub}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-5">
                        <Activity size={36} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-2">No activity yet</h4>
                      <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Connect your Stripe account to see transactions, subscriptions, and customer activity in real-time
                      </p>
                      <button onClick={handleStripeConnect} className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                        Connect Stripe
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Sidebar */}
              <aside className="col-span-12 lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-6">

                  {/* Health Score */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          Business Health
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-6xl font-bold ${healthScore != null ? "text-white" : "text-gray-500"}`}>
                            {healthScore ?? "—"}
                          </span>
                          <span className="text-gray-500 text-xl font-semibold">/100</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Activity size={24} className="text-white" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Retention Rate</span>
                        <span className={`font-semibold ${totalCust > 0 ? "text-white" : "text-gray-500"}`}>
                          {retentionRate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Payment Success</span>
                        <span className={`font-semibold ${(successful + failed) > 0 ? "text-white" : "text-gray-500"}`}>
                          {paymentSuccess}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 font-medium">Active Customers</span>
                        <span className={`font-semibold ${cust?.activeCustomers != null ? "text-white" : "text-gray-500"}`}>
                          {fmtNum(cust?.activeCustomers)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Weekly Average</span>
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <p className={`text-3xl font-bold mb-1 ${rev?.averageDailyRevenue != null ? "text-gray-900" : "text-gray-400"}`}>
                        {weeklyAvg}
                      </p>
                      <p className="text-xs text-gray-500">Revenue per week</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Customer LTV</span>
                        <Users size={16} className="text-gray-400" />
                      </div>
                      <p className={`text-3xl font-bold mb-1 ${parseFloat(cust?.averageCustomerLifetimeValue) > 0 ? "text-gray-900" : "text-gray-400"}`}>
                        {parseFloat(cust?.averageCustomerLifetimeValue) > 0 ? fmtCurrency(cust.averageCustomerLifetimeValue) : "—"}
                      </p>
                      <p className="text-xs text-gray-500">Lifetime value</p>
                    </div>
                  </div>

                  {/* CTA — only shown when Stripe is not connected */}
                  {stripeConnected !== true && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <h4 className="text-base font-bold text-gray-900 mb-2">Start Tracking</h4>
                      <p className="text-xs text-gray-700 mb-5 leading-relaxed">
                        Connect your Stripe account to unlock real-time insights and analytics
                      </p>
                      <button onClick={handleStripeConnect} className="w-full px-4 py-3 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
                        Connect Now
                      </button>
                    </div>
                  )}

                </div>
              </aside>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
