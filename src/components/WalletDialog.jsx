import { useState } from "react";
import Modal from "./Modal";
import Icon from "./Icon";
import { WALLET_TYPES, CURRENCIES, currencySymbol } from "../utils";
import "./Modal.scss";

function WalletDialog({ wallet, onSave, onClose }) {
  const [form, setForm] = useState({
    name: wallet?.name ?? "",
    type: wallet?.type ?? "card",
    currency: wallet?.currency ?? "USD",
    startBalance: wallet ? String(wallet.startBalance) : "",
  });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Give the wallet a name, for example “Main card”.");
      return;
    }

    onSave({
      name: form.name.trim(),
      type: form.type,
      currency: form.currency,
      startBalance: Number(form.startBalance) || 0,
    });
  }

  return (
    <Modal
      title={wallet ? "Edit wallet" : "New wallet"}
      subtitle={wallet ? "Transactions stay attached to this wallet." : "Each wallet keeps its own balance and currency."}
      icon={wallet ? "edit" : "wallet"}
      onClose={onClose}
    >
      <form className="modal__form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          Name
          <input
            value={form.name}
            placeholder="Wallet name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
        </label>

        <div className="field">
          <span className="field__label">Type</span>
          <div className="chips">
            {WALLET_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                className={form.type === t.value ? "chip is-active" : "chip"}
                onClick={() => setForm({ ...form, type: t.value })}
              >
                <Icon name={t.icon} size={20} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="modal__row">
          <label className="field">
            Currency
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} ({currencySymbol(c)})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Starting balance
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0"
              value={form.startBalance}
              onChange={(e) => setForm({ ...form, startBalance: e.target.value })}
            />
          </label>
        </div>

        {error && (
          <div className="field__error" role="alert">
            <Icon name="alert" size={18} />
            {error}
          </div>
        )}

        <div className="modal__footer" style={{ marginTop: 6 }}>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn">
            {wallet ? "Save changes" : "Create wallet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default WalletDialog;
