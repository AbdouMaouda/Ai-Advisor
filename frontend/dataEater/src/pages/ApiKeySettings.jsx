import { useState, useEffect } from "react";
import { usePageTitle } from "../hooks/usePageTitle.js";
import Sidebar from "../components/sidebar.jsx";
import { useApiClient } from "../api/client.js";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X, Key, Save, Trash2, CheckCircle, AlertCircle } from "lucide-react";

const PROVIDERS = [
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "openai", label: "OpenAI (GPT)" },
  { value: "ollama", label: "Ollama (Self-hosted)" },
];

export default function ApiKeySettings() {
  usePageTitle("Settings | DataEater");
  const api = useApiClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3");
  const [maskedKey, setMaskedKey] = useState(null);
  const [configured, setConfigured] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success"|"error", message }
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get("/api/user/api-key").then((data) => {
      if (data?.configured) {
        setConfigured(true);
        setProvider(data.provider ?? "anthropic");
        setOllamaUrl(data.ollamaUrl || "http://localhost:11434");
        setOllamaModel(data.ollamaModel || "llama3");
        setMaskedKey(data.maskedKey ?? null);
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setStatus(null);
    const needsKey = provider === "anthropic" || provider === "openai";
    // Block save if a key is required, the field is blank, and there's no existing key saved yet
    if (needsKey && !apiKey.trim() && !configured) {
      setStatus({ type: "error", message: "Please enter an API key." });
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/user/api-key", {
        provider,
        apiKey: apiKey || undefined,
        ollamaUrl: provider === "ollama" ? ollamaUrl : undefined,
        ollamaModel: provider === "ollama" ? ollamaModel : undefined,
      });
      setConfigured(true);
      if (apiKey) setMaskedKey(apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length - 4));
      setApiKey("");
      setStatus({ type: "success", message: "AI provider saved successfully." });
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setStatus(null);
    try {
      await api.del("/api/user/api-key");
      setConfigured(false);
      setMaskedKey(null);
      setApiKey("");
      setStatus({ type: "success", message: "AI provider configuration removed." });
    } catch {
      setStatus({ type: "error", message: "Failed to delete. Please try again." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-white border border-gray-200"
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
        >
          <X size={22} />
        </button>
        <Sidebar />
      </aside>

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-0"}`}>
        <div className="border-b border-gray-200">
          <div className="px-8 lg:px-12 py-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <Key size={16} />
              <span className="font-medium">Settings</span>
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">AI Provider</h1>
            <p className="text-gray-600 max-w-2xl">
              Configure your AI provider to enable insights, daily briefs, and action recommendations.
            </p>
          </div>
        </div>

        <div className="px-8 lg:px-12 py-12">
          <div className="max-w-xl">

            {status && (
              <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
                status.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {status.type === "success"
                  ? <CheckCircle size={18} />
                  : <AlertCircle size={18} />}
                <span className="text-sm font-medium">{status.message}</span>
              </div>
            )}

            {configured && maskedKey && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Key</p>
                <p className="text-sm font-mono text-gray-800">{maskedKey}</p>
                <p className="text-xs text-gray-500 mt-1">Provider: {provider}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => { setProvider(e.target.value); setApiKey(""); }}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {provider !== "ollama" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key {configured && maskedKey && <span className="text-gray-400 font-normal">(leave blank to keep existing)</span>}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={configured ? "Enter new key to replace" : "sk-..."}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              )}

              {provider === "ollama" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ollama URL</label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                      placeholder="http://localhost:11434"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={ollamaModel}
                      onChange={(e) => setOllamaModel(e.target.value)}
                      placeholder="llama3"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving…" : "Save"}
                </button>

                {configured && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deleting ? "Removing…" : "Remove"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
