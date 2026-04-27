import { useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import DataSourceCard from "../components/Card.jsx";
import { useApiClient } from "../api/client.js";
import { useStripe } from "../contexts/StripeContext.jsx";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

export default function DataSource() {
  usePageTitle("Connect Data | DataEater");
  const api = useApiClient();
  const { stripeConnected } = useStripe();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStripeConnect = async () => {
    try {
      const data = await api.post("/api/stripe/create-account-link");
      if (data?.url) window.location.href = data.url;
    } catch (e) {
      console.error("Failed to create Stripe link", e);
    }
  };

  const dataSources = [
    {
      name: "Stripe",
      description: "Connect your Stripe account to sync payment and customer data in real-time",
      logo: "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=1082",
      available: true,
      category: "Payments"
    },
    {
      name: "Google Ads",
      description: "Import advertising performance and campaign metrics from your Google Ads account",
      icon: "📊",
      available: false,
      category: "Marketing"
    },
    {
      name: "Meta Ads",
      description: "Sync Facebook and Instagram ad campaigns, insights, and audience data",
      logo: "https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg",
      available: false,
      category: "Marketing"
    },
    {
      name: "Shopify",
      description: "Connect your e-commerce store to track sales, orders, and inventory metrics",
      logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg",
      available: false,
      category: "E-commerce"
    },
    {
      name: "Salesforce",
      description: "Integrate CRM data including leads, opportunities, and sales pipeline",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/512px-Salesforce.com_logo.svg.png",
      available: false,
      category: "CRM"
    },
    {
      name: "HubSpot",
      description: "Sync marketing automation, sales, and customer service data",
      logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
      available: false,
      category: "CRM"
    },
    {
      name: "Google Analytics",
      description: "Import website traffic, user behavior, and conversion analytics",
      logo: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
      available: false,
      category: "Analytics"
    },
    {
      name: "Mailchimp",
      description: "Connect email marketing campaigns and subscriber engagement metrics",
      icon: "✉️",
      available: false,
      category: "Email Marketing"
    },
    {
      name: "QuickBooks",
      description: "Sync accounting data, invoices, and financial reports",
      icon: "💰",
      available: false,
      category: "Accounting"
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
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

      <main className={`p-8 lg:p-12 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Data Sources</h1>
            <p className="text-gray-600 text-lg">
              Connect your data sources to start analyzing your business metrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((source) => (
              <DataSourceCard
                key={source.name}
                source={source}
                isConnected={source.name === "Stripe" && stripeConnected === true}
                onConnect={source.name === "Stripe" ? handleStripeConnect : undefined}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
