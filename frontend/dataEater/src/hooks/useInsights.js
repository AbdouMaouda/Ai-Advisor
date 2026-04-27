import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useStripe } from "../contexts/StripeContext.jsx";

export function useInsights() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { stripeConnected } = useStripe();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (stripeConnected === false) {
      setLoading(false);
      setInsights(null);
      setError(null);
      return;
    }
    if (stripeConnected === null) return; // wait for stripe status to resolve
    setLoading(true);
    setError(null);
    getToken()
      .then((token) => {
        if (!token) {
          console.warn("[useInsights] no token, skipping fetch");
          return null;
        }
        return fetch("http://localhost:8080/api/ai/insights", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
      })
      .then((res) => {
        if (!res) return null;
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        return res.text();
      })
      .then((text) => setInsights(text ? JSON.parse(text) : null))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [getToken, stripeConnected]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    load();
  }, [isLoaded, isSignedIn, load]);

  const apiKeyRequired = !loading && insights?.summary === "api_key_required";
  const apiKeyInvalid  = !loading && insights?.summary === "api_key_invalid";

  return { insights, loading, error, retry: load, noStripe: stripeConnected === false, apiKeyRequired, apiKeyInvalid };
}
