import Home from "./pages/Home.jsx";
import { StripeProvider } from "./contexts/StripeContext.jsx";
import DataSource from "./pages/DataSource.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import DailyBrief from "./pages/DailyBrief.jsx";
import ActionDetails from "./pages/ActionDetails.jsx";
import Insights from "./pages/Insights.jsx";
import FullInsights from "./pages/FullInsights.jsx";
import ApiKeySettings from "./pages/ApiKeySettings.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { usePageTitle } from "./hooks/usePageTitle.js";

import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";

function HomeRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

function SignInPage() {
  usePageTitle("Sign In | DataEater");
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f9fafb" }}>
      <SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />
    </div>
  );
}

function SignUpPage() {
  usePageTitle("Sign Up | DataEater");
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f9fafb" }}>
      <SignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />
    </div>
  );
}

function App() {
  return (
    <StripeProvider>
      <Routes>
        <Route path="/" element={<HomeRoute />} />

      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route path="/datasource" element={<ProtectedRoute><DataSource /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dailybrief" element={<ProtectedRoute><DailyBrief /></ProtectedRoute>} />
      <Route path="/actiondetails" element={<ProtectedRoute><ActionDetails /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="/fullinsights" element={<ProtectedRoute><FullInsights /></ProtectedRoute>} />
      <Route path="/settings/api-key" element={<ProtectedRoute><ApiKeySettings /></ProtectedRoute>} />
    </Routes>
    </StripeProvider>
  );
}

export default App;
