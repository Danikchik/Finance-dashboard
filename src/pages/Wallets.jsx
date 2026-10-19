import { useState } from "react";
import WalletDialog from "../components/WalletDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import Icon from "../components/Icon";
import { useToast } from "../components/toastContext";
import { WALLET_TYPES, formatMoney, getWalletBalance, makeId } from "../utils";
import "./Wallets.scss";

function Wallets({
  wallets,
  allTransactions,
  selectedWallet,
  setSelectedId,
  setWallets,
  setTransactions,
}) {
  const showToast = useToast();

  const [dialog, setDialog] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  function handleSave(data) {
    if (dialog === "new") {
      const wallet = { id: makeId(), ...data };
      setWallets((list) => [...list, wallet]);
      setSelectedId(wallet.id);
      showToast("Wallet created");
    } else {
      setWallets((list) => list.map((w) => (w.id === dialog.id ? { ...w, ...data } : w)));
      showToast("Changes saved");
    }
    setDialog(null);
  }

  function handleDelete() {
    const wallet = toDelete;
    const removedTransactions = allTransactions.filter((t) => t.walletId === wallet.id);

    setWallets((list) => list.filter((w) => w.id !== wallet.id));
    setTransactions((list) => list.filter((t) => t.walletId !== wallet.id));
    setToDelete(null);

    showToast(`“${wallet.name}” deleted`, {
      actionLabel: "Undo",
      onAction: () => {
        setWallets((list) => [...list, wallet]);
        setTransactions((list) => [...list, ...removedTransactions]);
      },
    });
  }

  const countFor = (wallet) => allTransactions.filter((t) => t.walletId === wallet.id).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Wallets</h1>
          <p>Balance is the starting amount plus income minus expenses.</p>
        </div>
        <div className="page-head__actions">
          <button className="btn" onClick={() => setDialog("new")}>
            <Icon name="plus" size={18} />
            New wallet
          </button>
        </div>
      </div>

      {wallets.length === 0 ? (
        <div className="empty">
          <span className="empty__icon">
            <Icon name="wallet" size={24} />
          </span>
          <strong>No wallets yet</strong>
          <p>A wallet is an account, card or cash pile you want to track.</p>
          <button className="btn" onClick={() => setDialog("new")}>
            Create a wallet
          </button>
        </div>
      ) : (
        <div className="wallet-grid">
          {wallets.map((wallet) => {
            const isActive = selectedWallet && selectedWallet.id === wallet.id;
            const type = WALLET_TYPES.find((t) => t.value === wallet.type);

            return (
              <article
                key={wallet.id}
                className={`wallet-card wallet-card--${wallet.type}${isActive ? " is-active" : ""}`}
              >
                <div className="wallet-card__top">
                  <span className="wallet-card__icon">
                    <Icon name={type?.icon} size={20} />
                  </span>
                  <span className="wallet-card__type">{type?.label}</span>
                  {isActive && <span className="wallet-card__badge">Active</span>}
                </div>

                <h2>{wallet.name}</h2>

                <div className="wallet-card__balance num">
                  {formatMoney(getWalletBalance(wallet, allTransactions), wallet.currency)}
                </div>
                <div className="wallet-card__meta">
                  {wallet.currency}, {countFor(wallet)} transactions
                </div>

                <div className="wallet-card__actions">
                  {!isActive && (
                    <button className="wallet-card__btn" onClick={() => setSelectedId(wallet.id)}>
                      Make active
                    </button>
                  )}
                  <button
                    className="wallet-card__icon-btn"
                    onClick={() => setDialog(wallet)}
                    aria-label={`Edit ${wallet.name}`}
                  >
                    <Icon name="edit" size={18} />
                  </button>
                  <button
                    className="wallet-card__icon-btn"
                    onClick={() => setToDelete(wallet)}
                    aria-label={`Delete ${wallet.name}`}
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {dialog && (
        <WalletDialog
          wallet={dialog === "new" ? null : dialog}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title={`Delete “${toDelete.name}”?`}
          message={
            countFor(toDelete) > 0
              ? `Its ${countFor(toDelete)} transactions will be deleted too. You can undo this right after.`
              : "This wallet has no transactions. You can undo this right after."
          }
          confirmLabel="Delete wallet"
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export default Wallets;
