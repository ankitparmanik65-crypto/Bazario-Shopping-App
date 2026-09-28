import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import "./Navbar.css";

function Navbar({
  cartCount,
  onCartClick,
  wishlistCount,
  isDarkMode,
  onThemeToggle,
  user,
  isAuthenticated,
  isAdmin,
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="logo">
          <Logo size={38} showText={true} variant="gradient" />
        </Link>

        {/* ACTIONS */}
        <div className="navbar-actions">
          <button
            className="icon-button theme-toggle-button"
            onClick={onThemeToggle}
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Light mode" : "Dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {isAdmin && (
            <Link to="/admin" className="nav-button admin-btn" title="Admin">
              <span className="nav-icon">👑</span>
              <span className="nav-label">Admin</span>
            </Link>
          )}

          <Link to="/orders" className="nav-button orders-button">
            <span className="nav-icon">📦</span>
            <span className="nav-label">Orders</span>
          </Link>

          <Link to="/wishlist" className="nav-button wishlist-button">
            <span className="nav-icon">❤️</span>
            <span className="nav-label">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </Link>

          <button className="nav-button cart-button" onClick={onCartClick}>
            <span className="nav-icon">🛒</span>
            <span className="nav-label">Cart</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>

          <span className="nav-divider"></span>

          {isAuthenticated ? (
            <div className="user-section">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {user?.name?.split(" ")[0]}
                </span>
                {isAdmin && <span className="user-role">Admin</span>}
              </div>
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;