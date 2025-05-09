import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/shared/Layout";
import { EventList } from "@/pages/EventList";
import { Token } from "@/pages/Token";
import { Agents } from "@/pages/Agents";
import { KYC } from "@/pages/KYC";
import { Home } from "@/pages/Home";
import { About } from "@/pages/SidebarPages/About";

import { Docs } from "./pages/SidebarPages";
import { Compliance } from "./pages/Compliance";
import { RWAInfo } from "./pages/SidebarPages/RWAInfo";
import { Register } from "./pages/Register";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona para Home no primeiro acesso */}
        <Route path="/" element={<Home />} />

        {/* Dashboard é o layout principal que contém Sidebar e Header */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="about" element={<About />} />
          <Route path="rwa-info" element={<RWAInfo />} />
          <Route path="docs" element={<Docs />} />
          <Route path="events" element={<EventList />} />
          <Route path="tokens" element={<Token />} />
          <Route path="agents" element={<Agents />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="kyc" element={<KYC />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Página 404 caso a rota não exista */}
        <Route path="*" element={<Navigate to="/dashboard/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
