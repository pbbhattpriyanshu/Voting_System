import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineClipboardCheck, HiOutlineChartBar, HiOutlineUser, HiOutlineLogout, HiOutlineCog, HiOutlineShieldCheck } from 'react-icons/hi';
import { authAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <HiOutlineHome /> },
    { to: '/vote', label: 'Vote', icon: <HiOutlineClipboardCheck /> },
    { to: '/results', label: 'Results', icon: <HiOutlineChartBar /> },
  ];

  return (
    <>
      <nav className="navbar" id="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" id="navbar-logo">
            <div className="navbar-logo-icon">🗳️</div>
            <div className="navbar-logo-text">
              Vote<span>Adhikar</span>
            </div>
          </Link>

          {/* Center Nav Links */}
          {user && (
            <div className="navbar-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="navbar-actions">
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-btn"
                >
                  <div className="user-avatar">{getInitials(user.name)}</div>
                  <span className="user-name">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown" id="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-header-name">{user.name}</div>
                      <div className="dropdown-header-role">{user.role}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      id="dropdown-profile"
                    >
                      <HiOutlineUser />
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                        id="dropdown-admin"
                      >
                        <HiOutlineShieldCheck />
                        Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                      id="dropdown-logout"
                    >
                      <HiOutlineLogout />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" id="nav-login-btn">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                  Get started
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                className="hamburger"
                onClick={() => setMobileOpen(!mobileOpen)}
                id="hamburger-btn"
              >
                <span /><span /><span />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {user && (
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <HiOutlineUser />
            Profile
          </NavLink>
          <button className="nav-link" style={{ color: '#f87171' }} onClick={handleLogout}>
            <HiOutlineLogout />
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
