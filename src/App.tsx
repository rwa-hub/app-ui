import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/shared/Layout";
import { EventList } from "@/pages/EventList";
import { Token } from "@/pages/Token";
import { Agents } from "@/pages/Agents";
import { KYC } from "@/pages/KYC";
import { Home } from "@/pages/Home";
import { About } from "@/pages/SidebarPages/About";
import { RWA } from "@/pages/SidebarPages/RWA";
import { Docs } from "./pages/SidebarPages";
import { Compliance } from "./pages/Compliance";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona para Home no primeiro acesso */}
        <Route path="/" element={<Home />} />

        {/* Dashboard é o layout principal que contém Sidebar e Header */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="rwa" element={<RWA />} />
          <Route path="about" element={<About />} />
          <Route path="docs" element={<Docs />} />
          <Route path="events" element={<EventList />} />
          <Route path="tokens" element={<Token />} />
          <Route path="agents" element={<Agents />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="kyc" element={<KYC />} />
        </Route>

        {/* Página 404 caso a rota não exista */}
        <Route path="*" element={<Navigate to="/dashboard/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
