import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      {user && <Navbar />}
      
      <main className="main-content">
        <Outlet />
      </main>

      {user && <Footer />}
    </div>
  );
}
