import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import Footer from "./Footer";

import {
  LayoutDashboard,
  Users,
  GitBranch,
  FileText,
  ShieldCheck,
  Bot,
} from "lucide-react";

import "../styles/layout.css";

interface Props {
  children: ReactNode;
}

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Leads", path: "/leads", icon: Users },
  { name: "Pipeline", path: "/pipeline", icon: GitBranch },
  { name: "Documents", path: "/documents", icon: FileText },
  { name: "Risk Engine", path: "/risk", icon: ShieldCheck },
  { name: "AI Automation Assistant", path: "/assistant", icon: Bot },
];

export default function Layout({ children }: Props) {
  const location = useLocation();

  return (
    <div className="app">
      {/* ---------- Sidebar ---------- */}
      <aside className="sidebar">
        <h1 className="logo">ARINSA_FinanceAI</h1>

        <nav className="menu">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`menu-item ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="footer">© {new Date().getFullYear()} Arinsa FinanceAI</div>
      </aside>

      {/* ---------- Main Area ---------- */}
      <div className="main">
        {/* ---------- Topbar ---------- */}
        <header className="topbar">
          <h2 className="topbar-title">AI-Powered Loan Intelligence</h2>
          <div className="topbar-badge">Demo Mode</div>
        </header>

        {/* ---------- Content + Footer ---------- */}
        <div className="main-body">
          <main className="content">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
