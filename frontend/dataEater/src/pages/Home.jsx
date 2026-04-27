import { HomeNavbar } from "../components/NavBars.jsx";
import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";

function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="py-6">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between text-left gap-4"
            >
                <span className="text-base font-medium text-slate-900">{question}</span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
                    +
                </span>
            </button>
            {open && (
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                    {answer}
                </p>
            )}
        </div>
    );
}

export default function Home() {
    usePageTitle("DataEater - AI Business Analytics");
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">

            <HomeNavbar />

            {/* FLOATING GRADIENT BACKGROUND */}

            <div className="absolute inset-0 -z-10 overflow-hidden">

                {/* gradient 1 */}
                <div className="absolute w-[900px] h-[900px] bg-blue-300 opacity-40 rounded-full blur-[220px] animate-blob1 top-[-200px] left-[-200px]" />

                {/* gradient 2 */}
                <div className="absolute w-[900px] h-[900px] bg-emerald-300 opacity-40 rounded-full blur-[220px] animate-blob2 top-[200px] right-[-200px]" />

                {/* gradient 3 */}
                <div className="absolute w-[900px] h-[900px] bg-cyan-300 opacity-40 rounded-full blur-[220px] animate-blob3 bottom-[-200px] left-[30%]" />

            </div>

            <section className="flex flex-col items-center text-center mt-40 px-6 max-w-5xl mx-auto relative">

                <h1 className="text-[72px] leading-[1.05] font-semibold tracking-tight text-gray-900">

                    <span className="inline-block animate-word1 opacity-0">
                        Turn your business data
                    </span>

                    <br />

                    <span className="inline-block animate-word2 opacity-0">
                        into
                    </span>{" "}
                    <span className="inline-block animate-word3 opacity-0 relative">
                        {/* Flowing gradient background behind "decisions" */}
                        <span className="absolute inset-0 -z-10 overflow-visible">
                            <span className="absolute w-[1400px] h-[300px] bg-gradient-to-r from-blue-300 via-cyan-300 to-emerald-300 opacity-40 blur-[100px] animate-sinusGradient" />
                        </span>
                        <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                            decisions
                        </span>
                    </span>

                </h1>

                <p className="mt-8 text-xl text-gray-600 max-w-2xl">
                    Analyze revenue, churn, and growth automatically with your AI business advisor.
                </p>

                <div className="flex gap-6 mt-10">

                    <button className="px-8 py-4 rounded-full text-white bg-gradient-to-r from-blue-500 to-emerald-500 shadow-md hover:opacity-90 transition">
                        Connect Your Data
                    </button>

                    <button className="px-8 py-4 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                        View Demo
                    </button>

                </div>

            </section>


            {/* SOLUTIONS */}

            <section id="solutions" className="mt-40 px-8 max-w-7xl mx-auto">

                <div className="mb-16">

                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Solutions
                    </p>

                    <h2 className="text-5xl font-semibold tracking-tight text-slate-800 mt-4 leading-tight">
                        Analyze Smarter,
                        <br />
                        Grow Faster
                    </h2>

                    <p className="text-slate-500 text-lg mt-6 max-w-lg">
                        AI tools designed to transform your business data into clear,
                        actionable decisions.
                    </p>

                </div>
                {/* Tab bar */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-4">
                    {[
                        { id: "dashboard", label: "Dashboard" },
                        { id: "insights",  label: "Insights"  },
                        { id: "brief",     label: "Daily Brief" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-white shadow-sm text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Dashboard mockup ── */}
                {activeTab === "dashboard" && (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full">
                        {/* Fake top nav */}
                        <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">Dashboard</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Apr 26, 2025</span>
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400" />
                            </div>
                        </div>
                        <div className="p-5 bg-stone-50 space-y-4">
                            {/* Metric cards */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Total Revenue",     value: "$47,832", sub: "↑ 12.4%",  subColor: "text-emerald-600" },
                                    { label: "MRR",               value: "$12,450", sub: "↑ 8.2%",   subColor: "text-emerald-600" },
                                    { label: "Health Score",      value: "87/100",  sub: "Good",     subColor: "text-emerald-600" },
                                    { label: "Payment Success",   value: "98.2%",   sub: "127 active subs", subColor: "text-gray-400" },
                                ].map((m) => (
                                    <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
                                        <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                                        <p className="text-lg font-semibold text-gray-900">{m.value}</p>
                                        <p className={`text-xs mt-1 ${m.subColor}`}>{m.sub}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Mini bar chart */}
                            <div className="bg-white rounded-xl border border-gray-200 px-4 pt-3 pb-2">
                                <p className="text-xs text-gray-500 mb-3">Revenue (last 12 weeks)</p>
                                <div className="flex items-end gap-1 h-14">
                                    {[38, 52, 44, 68, 62, 77, 71, 88, 82, 91, 85, 100].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-sm bg-gradient-to-t from-blue-400 to-emerald-300 opacity-80"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Insights mockup ── */}
                {activeTab === "insights" && (
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full">
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span>✦</span>
                                <span className="font-medium">AI-Powered Analysis</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Insights</h3>
                        </div>
                        {/* Stats bar */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 grid grid-cols-4 gap-6">
                            {[
                                { label: "Total Insights", value: "12" },
                                { label: "Opportunities",  value: "5"  },
                                { label: "Risks",          value: "3"  },
                                { label: "Last Updated",   value: "Today" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
                                </div>
                            ))}
                        </div>
                        {/* Insight cards */}
                        <div className="p-4 space-y-3">
                            {[
                                { num: 1, title: "Revenue grew 23% this month",             desc: "Gross revenue increased from $38,800 to $47,832 — well above the 10% monthly benchmark.",         badge: null      },
                                { num: 2, title: "Churn risk detected for 3 customers",     desc: "3 high-value accounts show declining engagement. Proactive outreach is recommended this week.",   badge: "Risk"     },
                                { num: 3, title: "Upgrade opportunity in mid-tier segment", desc: "12 Starter accounts are hitting usage limits and are prime candidates for a Growth plan upgrade.", badge: "Opportunity" },
                            ].map((c) => (
                                <div key={c.num} className="border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                                    <div className="w-7 h-7 flex-shrink-0 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {c.num}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                                            {c.badge === "Risk" && (
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700">Risk</span>
                                            )}
                                            {c.badge === "Opportunity" && (
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700">Opportunity</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Daily Brief mockup ── */}
                {activeTab === "brief" && (
                    <div className="bg-stone-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full">
                        {/* Header */}
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <span>✦</span>
                                <span>AI Daily Brief • Saturday, Apr 26</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Overnight Business Intelligence</h3>
                        </div>
                        {/* AI Summary */}
                        <div className="mx-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-amber-500 text-sm">✦</span>
                                <h4 className="text-sm font-semibold">AI Summary</h4>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Your business performed well overnight. Revenue is up $1,240 from yesterday with 3 new subscriptions. Churn rate remains healthy at 1.8% — well below the industry average of 5%.
                            </p>
                        </div>
                        {/* Events + Actions grid */}
                        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                            <div className="bg-white rounded-2xl border border-stone-200 p-4">
                                <h4 className="text-sm font-semibold mb-3">Key Events (Last 24h)</h4>
                                <ul className="space-y-2">
                                    {[
                                        "3 new subscriptions activated",
                                        "1 account upgraded to Growth",
                                        "$1,240 in new recurring revenue",
                                    ].map((e) => (
                                        <li key={e} className="flex gap-2 text-xs text-slate-600">
                                            <span className="text-slate-400 flex-shrink-0">•</span>
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-2xl border border-stone-200 p-4">
                                <h4 className="text-sm font-semibold mb-3">Actions Required</h4>
                                <div className="space-y-3">
                                    {[
                                        { dot: "text-red-500",    label: "Urgent",       text: "Follow up on 2 overdue invoices"          },
                                        { dot: "text-orange-400", label: "Moderate",     text: "Review churn signals for 3 accounts"       },
                                        { dot: "text-blue-500",   label: "Low Priority", text: "Update pricing page with new plan tier"    },
                                    ].map((a) => (
                                        <div key={a.label} className="flex items-start gap-2">
                                            <span className={`${a.dot} text-xs mt-0.5 flex-shrink-0`}>●</span>
                                            <p className="text-xs">
                                                <span className="font-medium text-slate-800">{a.label}</span>
                                                <br />
                                                <span className="text-slate-500">{a.text}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </section>


            {/* HOW IT WORKS */}

            <section id="how-it-works" className="mt-40 px-8 max-w-7xl mx-auto">

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            How it works
                        </p>

                        <h2 className="text-5xl font-semibold mt-4 leading-tight text-slate-900">
                            Turn your business
                            <br />
                            data into decisions
                        </h2>

                    </div>

                    <p className="text-lg text-slate-500 max-w-md">
                        Our AI analyzes your business metrics and provides clear insights
                        to help you grow faster and make smarter decisions.
                    </p>

                </div>



                {/* STEPS */}

                <div className="grid md:grid-cols-3 border border-slate-200 rounded-xl overflow-hidden">


                    {/* STEP 1 */}

                    <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50 transition">

                        <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-sm font-semibold mb-6">
                            01
                        </div>

                        <h3 className="text-xl font-semibold mb-4">
                            Connect Your Data
                        </h3>

                        <p className="text-slate-500">
                            Securely connect your business platforms such as Stripe to
                            automatically import revenue, customer, and subscription data.
                        </p>

                    </div>


                    {/* STEP 2 */}

                    <div className="p-10 border-b md:border-b-0 md:border-r border-slate-200 hover:bg-slate-50 transition">

                        <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-sm font-semibold mb-6">
                            02
                        </div>

                        <h3 className="text-xl font-semibold mb-4">
                            AI Analyzes Your Metrics
                        </h3>

                        <p className="text-slate-500">
                            Our system calculates key business metrics such as revenue growth,
                            churn rate, and customer lifetime value to understand your
                            company's performance.
                        </p>

                    </div>


                    {/* STEP 3 */}

                    <div className="p-10 hover:bg-slate-50 transition">

                        <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-sm font-semibold mb-6">
                            03
                        </div>

                        <h3 className="text-xl font-semibold mb-4">
                            Get Actionable Insights
                        </h3>

                        <p className="text-slate-500">
                            Receive clear recommendations from your AI advisor on how to
                            improve growth, reduce churn, and optimize your business strategy.
                        </p>

                    </div>

                </div>

            </section>

            {/* GET STARTED STEPS */}

            <section className="mt-40 px-8 max-w-7xl mx-auto">

                <div className="mb-20">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Get started in minutes
                    </p>
                    <h2 className="text-5xl font-semibold tracking-tight text-slate-800 mt-4 leading-tight">
                        Up and running<br />in three steps
                    </h2>
                    <p className="text-slate-500 text-lg mt-6 max-w-lg">
                        From sign-up to your first AI insight in under five minutes.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid md:grid-cols-3 gap-10 relative">

                    {/* Connector line between icons */}
                    <div className="hidden md:block absolute h-px bg-gray-200"
                        style={{ top: "32px", left: "calc(16.666% + 32px)", right: "calc(16.666% + 32px)" }} />

                    {/* ── STEP 1 ── */}
                    <div className="flex flex-col items-center text-center">

                        {/* Icon + badge */}
                        <div className="relative mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-md">
                                {/* Sparkles / AI */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                                1
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Connect Your AI Provider</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                            Add your Anthropic or OpenAI API key to power intelligent business insights tailored to your data.
                        </p>

                        {/* AI Settings mockup */}
                        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">AI Provider Settings</p>
                            <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-1.5">Provider</p>
                                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 flex items-center justify-between bg-gray-50">
                                    <span>Anthropic (Claude)</span>
                                    <span className="text-gray-400">▾</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-xs font-medium text-gray-700 mb-1.5">API Key</p>
                                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-400 bg-gray-50 font-mono tracking-wide">
                                    sk-ant-api03-••••••••••••••
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg">
                                    Save
                                </div>
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                    <span>✓</span> Connected
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* ── STEP 2 ── */}
                    <div className="flex flex-col items-center text-center">

                        {/* Icon + badge */}
                        <div className="relative mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-md">
                                {/* Credit card */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                                2
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Connect Your Stripe Account</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                            Securely link your Stripe account in one click. We read your data — we never touch your money.
                        </p>

                        {/* Data source mockup */}
                        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-left shadow-sm">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">Data Sources</p>
                            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">S</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Stripe</p>
                                        <p className="text-xs text-gray-500">Payments · Revenue · Subscriptions</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg flex-shrink-0">
                                    Connect
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                    <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z" clipRule="evenodd" />
                                </svg>
                                <span>Read-only access — we never touch your funds</span>
                            </div>
                        </div>

                    </div>

                    {/* ── STEP 3 ── */}
                    <div className="flex flex-col items-center text-center">

                        {/* Icon + badge */}
                        <div className="relative mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-md">
                                {/* Bolt / zap */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                </svg>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                                3
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Get Actionable Insights</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs">
                            Your AI advisor analyzes your revenue, churn, and growth in real time — and tells you exactly what to do next.
                        </p>

                        {/* Insights mockup */}
                        <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-left">
                            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Insights</p>
                                    <p className="text-xl font-semibold text-gray-900">12</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Opportunities</p>
                                    <p className="text-xl font-semibold text-emerald-600">5</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Risks</p>
                                    <p className="text-xl font-semibold text-red-500">3</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { text: "Revenue grew 23% this month",         badge: null       },
                                    { text: "Churn risk for 3 high-value accounts", badge: "risk"     },
                                    { text: "12 accounts ready for plan upgrade",   badge: "oppty"    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 border border-gray-100 rounded-lg p-3">
                                        <div className="w-5 h-5 flex-shrink-0 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                            {i + 1}
                                        </div>
                                        <p className="text-xs text-gray-800 font-medium flex-1">{item.text}</p>
                                        {item.badge === "risk" && (
                                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 flex-shrink-0">Risk</span>
                                        )}
                                        {item.badge === "oppty" && (
                                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 flex-shrink-0">Oppty</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* FAQ */}

            <section id="faq" className="mt-40 px-8 max-w-3xl mx-auto pb-32">

                <div className="text-center mb-16">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        FAQ
                    </p>
                    <h2 className="text-5xl font-semibold tracking-tight text-slate-800 mt-4 leading-tight">
                        Common questions
                    </h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {[
                        {
                            q: "Which AI providers are supported?",
                            a: "DataEater works with Anthropic (Claude) and OpenAI (GPT-4o mini). You bring your own API key — we never store it in plain text. Ollama is also supported for self-hosted setups.",
                        },
                        {
                            q: "Is my Stripe data safe?",
                            a: "Yes. We request read-only access to your Stripe account. We cannot initiate charges, issue refunds, or move funds. Your data is encrypted in transit and at rest.",
                        },
                        {
                            q: "How often are insights updated?",
                            a: "You can trigger a fresh analysis at any time from the Dashboard. Insights are recalculated against the latest data pulled from your connected accounts.",
                        },
                        {
                            q: "Do I need a technical background to use DataEater?",
                            a: "Not at all. Connecting your accounts takes a few clicks, and all AI output is written in plain English — no dashboards to configure, no SQL to write.",
                        },
                        {
                            q: "Can I use DataEater without a Stripe account?",
                            a: "Stripe is the first supported data source. More integrations — including Shopify, Google Ads, and Salesforce — are on the roadmap.",
                        },
                        {
                            q: "What happens to my data if I delete my account?",
                            a: "All your data — metrics, snapshots, and API keys — is permanently deleted within 24 hours of account removal. We don't sell or share your data.",
                        },
                    ].map(({ q, a }, i) => (
                        <FaqItem key={i} question={q} answer={a} />
                    ))}
                </div>

            </section>

            {/* FOOTER */}

            <footer className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-8 py-16">

                    <div className="grid md:grid-cols-4 gap-12 mb-16">

                        {/* Brand */}
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">DataEater</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                AI-powered business intelligence for modern SaaS companies.
                            </p>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Dashboard</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition-colors">AI Insights</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Daily Brief</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Action Items</a></li>
                            </ul>
                        </div>

                        {/* Integrations */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Integrations</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Stripe</a></li>
                                <li><span className="text-gray-300">Shopify — coming soon</span></li>
                                <li><span className="text-gray-300">Google Ads — coming soon</span></li>
                                <li><span className="text-gray-300">Salesforce — coming soon</span></li>
                            </ul>
                        </div>

                        {/* AI Providers */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">AI Providers</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Anthropic (Claude)</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition-colors">OpenAI (GPT)</a></li>
                                <li><a href="#" className="hover:text-gray-900 transition-colors">Ollama (self-hosted)</a></li>
                            </ul>
                        </div>

                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} DataEater. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
                        </div>
                    </div>

                </div>
            </footer>

        </div>
    );
}