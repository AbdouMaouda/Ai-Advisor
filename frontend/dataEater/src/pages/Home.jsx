import { HomeNavbar } from "../components/NavBars.jsx";
import { useState } from "react";

export default function Home() {
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

            <section className="mt-40 px-8 max-w-7xl mx-auto">

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
                <div className="border border-gray-300 rounded-lg p-6 h-[300px] min-w-[250px] flex-shrink-0 flex items-center justify-center text-gray-400">
                    Product Screenshot
                </div>

            </section>


            {/* HOW IT WORKS */}

            <section className="mt-40 px-8 max-w-7xl mx-auto">

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

            {/* PRICING */}

            <section className="mt-40 px-8 max-w-7xl mx-auto text-center">

                <h2 className="text-5xl font-semibold text-gray-900">
                    Simple Pricing
                </h2>

                <p className="text-gray-500 mt-4">
                    Choose the plan that fits your business.
                </p>


                <div className="grid md:grid-cols-3 gap-8 mt-16">


                    {/* STARTER */}

                    <div className="border rounded-xl p-8 hover:shadow-lg transition">

                        <h3 className="text-xl font-semibold">Starter</h3>

                        <p className="text-4xl font-bold mt-4">$49</p>

                        <p className="text-gray-500">per month</p>

                        <ul className="mt-8 space-y-3 text-gray-600">

                            <li>Stripe integration</li>
                            <li>Core business metrics</li>
                            <li>AI insights</li>
                            <li>Email support</li>

                        </ul>

                        <button className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                            Start Free Trial
                        </button>

                    </div>



                    <div className="border rounded-xl p-8 shadow-xl scale-105">

                        <h3 className="text-xl font-semibold">Growth</h3>

                        <p className="text-4xl font-bold mt-4">$Comming soon</p>

                        <p className="text-gray-500">per month</p>

                        <ul className="mt-8 space-y-3 text-gray-600">

                            <li>Everything in Starter</li>
                            <li>Advanced AI insights</li>
                            <li>Customer analytics</li>
                            <li>Priority support</li>

                        </ul>

                        <button className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                            Get Started
                        </button>

                    </div>



                    <div className="border rounded-xl p-8 hover:shadow-lg transition">

                        <h3 className="text-xl font-semibold">Scale</h3>

                        <p className="text-4xl font-bold mt-4">Custom</p>

                        <p className="text-gray-500">for larger companies</p>

                        <ul className="mt-8 space-y-3 text-gray-600">

                            <li>Unlimited data sources</li>
                            <li>Custom AI models</li>
                            <li>Dedicated support</li>
                            <li>Custom integrations</li>

                        </ul>

                        <button className="mt-8 w-full py-3 rounded-full border">
                            Contact Sales
                        </button>

                    </div>


                </div>

            </section>


        </div>
    );
}