import { Lock, CheckCircle } from "lucide-react";

export default function DataSourceCard({ source, onConnect, isConnected }) {
  return (
    <div
      className={`relative bg-white border-2 rounded-xl p-6 transition-all ${
        source.available
          ? 'border-gray-200 hover:border-blue-400 hover:shadow-xl cursor-pointer'
          : 'border-gray-200 opacity-60 cursor-not-allowed'
      }`}
    >
      {!source.available && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            <Lock size={12} />
            Coming Soon
          </span>
        </div>
      )}

      {source.available && isConnected && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            <CheckCircle size={12} />
            Connected
          </span>
        </div>
      )}

      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
        {source.icon ? (
          <span className="text-3xl">{source.icon}</span>
        ) : (
          <img
            src={source.logo}
            alt={`${source.name} logo`}
            className="w-10 h-10 object-contain"
          />
        )}
      </div>

      <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
        {source.category}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{source.name}</h3>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {source.description}
      </p>

      {source.available ? (
        isConnected ? (
          <div className="w-full py-2.5 px-4 rounded-lg font-semibold bg-green-50 text-green-700 text-center border border-green-200">
            Connected
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="w-full py-2.5 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Connect
          </button>
        )
      ) : (
        <button
          className="w-full py-2.5 px-4 rounded-lg font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
          disabled
        >
          Not Available Yet
        </button>
      )}
    </div>
  );
}
