import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import { formatMoney, getWalletBalance } from "../utils";
import "./Sidebar.scss";

const links = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/transactions", label: "Transactions", icon: "list" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
  { to: "/wallets", label: "Wallets", icon: "wallet" },
];

function Sidebar({ wallets, selectedWallet, transactions, onSelectWallet }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__mark">
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
            <path
              d="M7 22l6-7 4 3 8-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Finance
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar__link is-active" : "sidebar__link"
            }
          >
            <Icon name={link.icon} size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__wallet">
        <label htmlFor="wallet-select">Active wallet</label>

        {selectedWallet && (
          <div className="sidebar__balance num">
            {formatMoney(
              getWalletBalance(selectedWallet, transactions),
              selectedWallet.currency
            )}
          </div>
        )}

        <select
          id="wallet-select"
          value={selectedWallet ? selectedWallet.id : ""}
          onChange={(e) => onSelectWallet(e.target.value)}
          disabled={wallets.length === 0}
        >
          {wallets.length === 0 && <option value="">No wallets yet</option>}
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.currency})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default Sidebar;
