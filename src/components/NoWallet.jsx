import { Link } from "react-router-dom";
import Icon from "./Icon";

function NoWallet() {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon name="wallet" size={24} />
      </span>
      <strong>No wallet yet</strong>
      <p>Create a wallet to start adding transactions and see your numbers here.</p>
      <Link className="btn" to="/wallets">
        Create a wallet
      </Link>
    </div>
  );
}

export default NoWallet;
