import { useState } from "react";
import NoWallet from "../components/NoWallet";
import CategoryBadge from "../components/CategoryBadge";
import TransactionDialog from "../components/TransactionDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import Icon from "../components/Icon";
import { useToast } from "../components/toastContext";
import { formatMoney, formatDayLabel, makeId } from "../utils";
import "./Transactions.scss";

function Transactions({ selectedWallet, walletTransactions, setTransactions }) {
  const showToast = useToast();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const [dialog, setDialog] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  if (!selectedWallet) {
    return (
      <>
        <div className="page-head">
          <h1>Transactions</h1>
        </div>
        <NoWallet />
      </>
    );
  }

  const currency = selectedWallet.currency;

  const visible = walletTransactions
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    .filter((t) => {
      const text = search.trim().toLowerCase();
      return (
        t.title.toLowerCase().includes(text) ||
        t.category.toLowerCase().includes(text)
      );
    })
    .sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );

  const groups = [];
  for (const t of visible) {
    const last = groups[groups.length - 1];
    if (last && last.date === t.date) last.items.push(t);
    else groups.push({ date: t.date, items: [t] });
  }

  function handleSave(data) {
    if (dialog === "new") {
      setTransactions((list) => [...list, { id: makeId(), walletId: selectedWallet.id, ...data }]);
      showToast("Transaction added");
    } else {
      setTransactions((list) => list.map((t) => (t.id === dialog.id ? { ...t, ...data } : t)));
      showToast("Changes saved");
    }
    setDialog(null);
  }

  function handleDelete() {
    const removed = toDelete;
    setTransactions((list) => list.filter((t) => t.id !== removed.id));
    setToDelete(null);

    showToast("Transaction deleted", {
      actionLabel: "Undo",
      onAction: () => setTransactions((list) => [...list, removed]),
    });
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Transactions</h1>
          <p>{selectedWallet.name}</p>
        </div>
        <div className="page-head__actions">
          <button className="btn" onClick={() => setDialog("new")}>
            <Icon name="plus" size={18} />
            Add transaction
          </button>
        </div>
      </div>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search by title or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div className="segmented" role="group" aria-label="Filter by type">
          {[
            { value: "all", label: "All" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Expenses" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={typeFilter === option.value ? "is-active" : ""}
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <span className="empty__icon">
            <Icon name={walletTransactions.length === 0 ? "list" : "search"} size={24} />
          </span>
          {walletTransactions.length === 0 ? (
            <>
              <strong>No transactions yet</strong>
              <p>Add your first income or expense and it will show up here.</p>
              <button className="btn" onClick={() => setDialog("new")}>
                Add transaction
              </button>
            </>
          ) : (
            <>
              <strong>Nothing found</strong>
              <p>Try a different word or switch the filter back to All.</p>
            </>
          )}
        </div>
      ) : (
        <div className="tx-groups">
          {groups.map((group) => (
            <section className="tx-group" key={group.date}>
              <h3>{formatDayLabel(group.date)}</h3>

              <ul className="panel tx-list">
                {group.items.map((t) => (
                  <li className="tx" key={t.id}>
                    <CategoryBadge category={t.category} />

                    <div className="tx__main">
                      <strong>{t.title}</strong>
                      <span className="muted">{t.category}</span>
                    </div>

                    <span className={t.type === "income" ? "num positive" : "num negative"}>
                      {t.type === "income" ? "+" : "−"}
                      {formatMoney(t.amount, currency)}
                    </span>

                    <div className="tx__actions">
                      <button
                        className="icon-btn"
                        onClick={() => setDialog(t)}
                        aria-label={`Edit ${t.title}`}
                      >
                        <Icon name="edit" size={18} />
                      </button>
                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => setToDelete(t)}
                        aria-label={`Delete ${t.title}`}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {dialog && (
        <TransactionDialog
          transaction={dialog === "new" ? null : dialog}
          currency={currency}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this transaction?"
          message="It will be removed from your history and the wallet balance will change."
          details={
            <>
              <CategoryBadge category={toDelete.category} size={36} />
              <div style={{ flex: 1 }}>
                <strong>{toDelete.title}</strong>
                <span>{toDelete.category}</span>
              </div>
              <strong className={toDelete.type === "income" ? "num positive" : "num negative"}>
                {toDelete.type === "income" ? "+" : "−"}
                {formatMoney(toDelete.amount, currency)}
              </strong>
            </>
          }
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

export default Transactions;
