import { Link, NavLink } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

function Navbar({ darkMode, setDarkMode }) {
  const { currency, changeCurrency } = useCurrency();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">CryptoDash</span>
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Market
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Watchlist
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Portfolio
          </NavLink>

          <select
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
            className="currency-select"
          >
            <option value="usd">USD</option>
            <option value="idr">IDR</option>
          </select>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            type="button"
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
