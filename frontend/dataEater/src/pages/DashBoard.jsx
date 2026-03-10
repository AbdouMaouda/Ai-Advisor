import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";

import {
  Bell,
  ChevronDown,
  Filter,
  Download,
  Plus,
  Menu,
  X,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  CreditCard,
  Receipt,
  Brain,
  CircleDollarSign
} from "lucide-react";


function PageContainer({ children }) {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-6 md:py-6">
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

function SidebarRail({ active, onChange }) {

  const items = [
    { key: "revenue", icon: DollarSign },
    { key: "customers", icon: Users },
    { key: "subscriptions", icon: CreditCard },
    { key: "invoices", icon: Receipt },
    { key: "insights", icon: Brain }
  ];

  return (
    <div className="hidden lg:flex lg:w-[72px] lg:flex-col lg:items-center lg:gap-3 lg:pt-20">

      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
        {items.map(({ key, icon: Icon }) => {

          const isActive = active === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition
              ${isActive
                ? "bg-amber-50 text-amber-700"
                : "text-slate-500 hover:bg-stone-50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}

      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <Surface className="mb-6 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <span className="text-sm font-semibold">DE</span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold md:text-xl">DataEater</h1>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Dashboard
              </span>
            </div>

            <p className="text-sm text-slate-500">
              Monitor revenue, retention, and business actions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TopNavChip label="Overview" active />
          <TopNavChip label="Metrics" />
          <TopNavChip label="Data Sources" />
          <TopNavChip label="Insights" />
          <TopNavChip label="Settings" />
        </div>

        <div className="flex items-center gap-2">
          <IconButton icon={Bell} label="Notifications" />

          <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-stone-200" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium">USERNAME</p>
              <p className="text-xs text-slate-500">Founder</p>
            </div>
          </div>
        </div>

      </div>
    </Surface>
  );
}

function TopNavChip({ label, active = false }) {
  return (
    <button
      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-stone-100 text-slate-600 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );
}

function IconButton({ icon: Icon, label }) {
  return (
    <button
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-600 hover:bg-stone-50"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function PageHeader() {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">

      <div>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome back
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
          Review cash performance, account activity, and recommended actions
          from your connected business data.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton icon={Filter} label="Filters" subtle />
        <ActionButton icon={Download} label="Export" subtle />
        <ActionButton icon={Plus} label="New source" />
      </div>

    </div>
  );
}

function ActionButton({ icon: Icon, label, subtle = false }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
        subtle
          ? "border border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
          : "bg-amber-500 text-white hover:bg-amber-600"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function SummaryPanel({ data }) {

  if (!data) return null;

  return (
    <Surface className="p-5 md:p-6">

      <div className="mb-6 flex items-start justify-between gap-4">

        <div>
          <h3 className="text-lg font-semibold">Revenue summary</h3>

          <p className="mt-1 text-sm text-slate-500">
            Weekly performance across your connected data.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm text-slate-600">
          {data.period}
          <ChevronDown className="h-4 w-4" />
        </button>

      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 border-b border-stone-200 pb-6">

        <MetricInline
          label="Net revenue"
          value={data.netRevenue}
          delta={data.netRevenueDelta}
          positive={data.netRevenuePositive}
        />

        <MetricInline
          label="Collected"
          value={data.collectedRevenue}
          delta={data.collectedDelta}
          positive={data.collectedPositive}
        />

      </div>

      <CashflowChart bars={data.cashflowBars} />

    </Surface>
  );
}

function MetricInline({ label, value, delta, positive }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">

        {positive
          ? <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          : <ArrowDownRight className="h-4 w-4 text-rose-600" />
        }

        <span className="text-xs font-medium text-slate-500">{label}</span>

      </div>

      <p className="text-2xl font-semibold">{value}</p>

      <p className={`mt-1 text-xs font-medium ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}>
        {delta}
      </p>

    </div>
  );
}

function CashflowChart({ bars = [] }) {

  if (!bars.length) {
    return (
      <div className="rounded-2xl bg-stone-50 p-4 h-48 flex items-center justify-center text-sm text-slate-400">
        No revenue data
      </div>
    );
  }

  const max = Math.max(...bars);

  return (
    <div className="rounded-2xl bg-stone-50 p-4">

      <div className="flex h-48 items-end gap-2 md:gap-3">

        {bars.map((value, i) => {

          const active = i < 6;

          return (
            <div key={i} className="flex flex-1 items-end">

              <div
                className={`w-full rounded-t-xl ${
                  active ? "bg-amber-500" : "bg-stone-300"
                }`}
                style={{ height: `${(value / max) * 100}%` }}
              />

            </div>
          );
        })}

      </div>

    </div>
  );
}

function ActivityPanel({ activity }) {

  if (!activity || !activity.length) return null;

  return (
    <Surface className="p-5 md:p-6">

      <div className="mb-6">

        <h3 className="text-lg font-semibold">Activity</h3>

        <p className="mt-1 text-sm text-slate-500">
          Revenue drivers and current watch items.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        {activity.map(metric => (
          <TrendPanel key={metric.title} {...metric} />
        ))}

      </div>

    </Surface>
  );
}

function TrendPanel({ title, value, change, positive, points = [], emphasized = false }) {

  return (
    <div className={`rounded-2xl border p-5 ${
      emphasized
        ? "border-amber-800 bg-amber-950 text-white"
        : "border-stone-200 bg-stone-50"
    }`}>

      <div className="mb-4 flex items-center gap-2">

        <CircleDollarSign className={`h-4 w-4 ${
          emphasized ? "text-amber-300" : "text-slate-500"
        }`} />

        <p className={`text-sm font-medium ${
          emphasized ? "text-white" : "text-slate-700"
        }`}>
          {title}
        </p>

      </div>

      <p className={`text-xs font-medium ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}>
        {change}
      </p>

      <p className="mt-1 text-3xl font-semibold">{value}</p>

      <div className="mt-5">
        <TrendMiniChart points={points} emphasized={emphasized} />
      </div>

    </div>
  );
}

function TrendMiniChart({ points = [], emphasized = false }) {

  if (!points.length) return null;

  const width = 220;
  const height = 70;

  const max = Math.max(...points);
  const min = Math.min(...points);

  const getY = (point) => {
    if (max === min) return height / 2;
    return height - ((point - min) / (max - min)) * (height - 8) - 4;
  };

  const d = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = getY(point);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full">
      <path
        d={d}
        fill="none"
        stroke={emphasized ? "#fb923c" : "#c08457"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsightPrompt({ insight }) {

  if (!insight) return null;

  return (
    <Surface className="p-5">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            Recommended action
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            {insight.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {insight.description}
          </p>

        </div>

        <button className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-stone-50">
          View insight
        </button>

      </div>

    </Surface>
  );
}

function TransactionsTable({ transactions = [] }) {

  if (!transactions.length) {
    return (
      <Surface className="p-6 text-sm text-slate-400">
        No transactions yet
      </Surface>
    );
  }

  return (
    <Surface className="p-5 md:p-6">

      <div className="overflow-x-auto">

        <table className="min-w-full border-separate border-spacing-0">

          <thead>
            <tr>
              {["Name","Type","Status","Date","Amount"].map(head => (
                <th key={head} className="px-4 py-3 text-left text-xs text-slate-500">
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {transactions.map(row => (

              <tr key={row.id}>

                <td className="px-4 py-4">
                  <p className="text-sm font-medium">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.id}</p>
                </td>

                <td className="px-4 py-4 text-sm">{row.type}</td>

                <td className="px-4 py-4">
                  <StatusBadge status={row.status} />
                </td>

                <td className="px-4 py-4 text-sm">{row.date}</td>

                <td className="px-4 py-4 text-sm font-medium">{row.amount}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Surface>
  );
}

function StatusBadge({ status }) {

  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    "At risk": "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
      styles[status] || "bg-stone-100 text-slate-700"
    }`}>
      {status}
    </span>
  );
}
export default function DashboardPage({ data = {} }) {

  const [active, setActive] = useState("revenue");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <PageContainer>

      {/* MOBILE SIDEBAR BUTTON */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        >
          <Menu size={22} />
        </button>
      )}

      {/* NAVIGATION SIDEBAR */}
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


      {/* MAIN DASHBOARD */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>

        <DashboardHeader />

        <div className="flex gap-6">

          {/* METRICS RAIL (unchanged) */}
          <SidebarRail
            active={active}
            onChange={setActive}
          />

          {/* CONTENT */}
          <div className="min-w-0 flex-1">

            <PageHeader />

            <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">

              <SummaryPanel data={data.summary} />

              <ActivityPanel activity={data.activity} />

            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">

              <InsightPrompt insight={data.insight} />

              <TransactionsTable
                transactions={data.transactions}
              />

            </div>

          </div>

        </div>

      </div>

    </PageContainer>
  );
}