import { useState } from "react";
import Modal from "./Modal";
import Icon from "./Icon";
import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  currencySymbol,
  today,
} from "../utils";
import "./Modal.scss";

function TransactionDialog({ transaction, currency, onSave, onClose }) {
  const [form, setForm] = useState({
    title: transaction?.title ?? "",
    amount: transaction ? String(transaction.amount) : "",
    category: transaction?.category ?? EXPENSE_CATEGORIES[0],
    date: transaction?.date ?? today(),
    type: transaction?.type ?? "expense",
  });
  const [error, setError] = useState("");

  const categories = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function changeType(type) {
    const list = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const category = list.includes(form.category) ? form.category : list[0];
    setForm({ ...form, type, category });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(form.amount);

    if (!amount || amount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!form.title.trim()) {
      setError("Add a short title, for example “Groceries”.");
      return;
    }
    if (!form.date) {
      setError("Choose a date.");
      return;
    }

    onSave({
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
      type: form.type,
    });
  }

  return (
    <Modal
      title={transaction ? "Edit transaction" : "New transaction"}
      subtitle={transaction ? "Changes update your balance right away." : "It will be added to the active wallet."}
      icon={transaction ? "edit" : "plus"}
      onClose={onClose}
    >
      <form className="modal__form" onSubmit={handleSubmit} noValidate>
        <div className="type-switch" role="group" aria-label="Transaction type">
          <button
            type="button"
            className={form.type === "expense" ? "is-active expense" : ""}
            onClick={() => changeType("expense")}
          >
            <Icon name="arrowUp" size={16} /> Expense
          </button>
          <button
            type="button"
            className={form.type === "income" ? "is-active income" : ""}
            onClick={() => changeType("income")}
          >
            <Icon name="arrowDown" size={16} /> Income
          </button>
        </div>

        <label className="field">
          Amount
          <div className="amount-field">
            <span>{currencySymbol(currency)}</span>
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              autoFocus
            />
          </div>
        </label>

        <label className="field">
          Title
          <input
            name="title"
            placeholder="What was it for?"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        <div className="field">
          <span className="field__label">Category</span>
          <div className={categories.length <= 2 ? "chips chips--two" : "chips"}>
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                className={form.category === name ? "chip is-active" : "chip"}
                onClick={() => setForm({ ...form, category: name })}
              >
                <span style={{ color: CATEGORY_META[name].color }}>
                  <Icon name={CATEGORY_META[name].icon} size={20} />
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        <label className="field">
          Date
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </label>

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
            {transaction ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default TransactionDialog;
