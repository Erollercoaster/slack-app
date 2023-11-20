import React from "react";
import { LogOut } from "lucide-react";

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem("authHeaders");
    window.location.href = "/";
  };

  return (
    <nav>
      <div className="sidebar-wrapper">
        <button onClick={handleLogout} className="logout-button">
          <LogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
