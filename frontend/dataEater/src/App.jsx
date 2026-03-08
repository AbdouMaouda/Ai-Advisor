import Home from "./pages/Home.jsx";
import DataSource from "./pages/DataSource.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import DailyBrief from "./pages/DailyBrief.jsx";
import ActionDetails from "./pages/ActionDetails.jsx";
import Insights from "./pages/Insights.jsx";
import FullInsights from "./pages/FullInsights.jsx";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/datasource" element={<DataSource />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/dailybrief" element={<DailyBrief />} />

      <Route path="/actiondetails" element={<ActionDetails />} />

      <Route path="/insights" element={<Insights />} />

      <Route path="/fullinsights" element={<FullInsights />} />

    </Routes>
  );
}

export default App;