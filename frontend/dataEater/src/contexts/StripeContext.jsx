import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const StripeContext = createContext({ stripeConnected: null, refetchStripe: () => {} });

export function StripeProvider({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [stripeConnected, setStripeConnected] = useState(null);

  const refetchStripe = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${BASE_URL}/api/stripe/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStripeConnected(data?.connected === true);
    } catch {
      setStripeConnected(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    refetchStripe();
  }, [isLoaded, isSignedIn, refetchStripe]);

  return (
    <StripeContext.Provider value={{ stripeConnected, refetchStripe }}>
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  return useContext(StripeContext);
}
