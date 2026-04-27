import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { authService } from '../api/authService';
import { LayoutDashboard, Users, Megaphone, BarChart2, Settings, LogOut, Menu, Moon, Sun } from 'lucide-react';

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch(err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`app-container ${theme}`}>
      <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
           <LayoutDashboard className="lucide-icon" style={{marginRight: '8px'}}/> 
           <span>Nexus CRM</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`nav-item ${location.pathname.includes('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
          <Link to="/usuarios" className={`nav-item ${location.pathname.includes('/usuarios') ? 'active' : ''}`}>
            <Users />
            <span>Usuarios</span>
          </Link>
          <Link to="/campanas" className={`nav-item ${location.pathname.includes('/campanas') ? 'active' : ''}`}>
            <Megaphone />
            <span>Campañas</span>
          </Link>
          <Link to="/reportes" className={`nav-item ${location.pathname.includes('/reportes') ? 'active' : ''}`}>
            <BarChart2 />
            <span>Reportes</span>
          </Link>
          <a href="#" className="nav-item">
            <Settings />
            <span>Settings</span>
          </a>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="icon-button" onClick={toggleSidebar}>
              <Menu />
            </button>
            <h3>Dashboard Overview</h3>
          </div>
          <div className="header-right">
            <button className="icon-button" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button className="icon-button" onClick={handleLogout}>
              <LogOut />
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
