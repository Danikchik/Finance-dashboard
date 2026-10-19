import { Link } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import NoWallet from "../components/NoWallet";
import CategoryBadge from "../components/CategoryBadge";
import Icon from "../components/Icon";
import {
  WALLET_TYPES,
  formatMoney,
  formatDate,
  getCategoryColor,
  getMonthKey,
  getWalletBalance,
  sumByType,
  getPercentChange,
} from "../utils";
import "./Dashboard.scss";

function Dashboard({ wallets, selectedWallet, setSelectedId, walletTransactions, allTransactions }) {
  if (!selectedWallet) {
    return (
      <>
        <div className="page-head">
          <h1>Dashboard</h1>
        </div>
        <NoWallet />
      </>
    );
  }

  const currency = selectedWallet.currency;
  const thisMonth = getMonthKey(0);
  const lastMonth = getMonthKey(-1);

  const thisMonthTx = walletTransactions.filter((t) => t.date.startsWith(thisMonth));
  const lastMonthTx = walletTransactions.filter((t) => t.date.startsWith(lastMonth));

  const balance = getWalletBalance(selectedWallet, walletTransactions);
  const income = sumByType(thisMonthTx, "income");
  const expenses = sumByType(thisMonthTx, "expense");
  const saved = income - expenses;

  const incomeChange = getPercentChange(income, sumByType(lastMonthTx, "income"));
  const expensesChange = getPercentChange(expenses, sumByType(lastMonthTx, "expense"));

  const recent = [...walletTransactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);


  const byCategory = {};
  for (const t of thisMonthTx) {
    if (t.type === "expense") {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }
  const categories = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const walletIcon = WALLET_TYPES.find((t) => t.value === selectedWallet.type)?.icon;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Here is how {selectedWallet.name} is doing this month.</p>
        </div>
      </div>

      <div className="dash-top">
        <section className="hero">
          <div className="hero__top">
            <span className="hero__label">Total balance</span>
            <span className="hero__wallet">
              <Icon name={walletIcon} size={16} />
              {selectedWallet.name}
            </span>
          </div>

          <div className="hero__amount num">{formatMoney(balance, currency)}</div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-icon hero__stat-icon--in">
                <Icon name="arrowDown" size={16} />
              </span>
              <div>
                <span className="hero__stat-label">Income</span>
                <strong className="num">{formatMoney(income, currency)}</strong>
                <Change value={incomeChange} goodWhenUp />
              </div>
            </div>

            <div className="hero__stat">
              <span className="hero__stat-icon hero__stat-icon--out">
                <Icon name="arrowUp" size={16} />
              </span>
              <div>
                <span className="hero__stat-label">Expenses</span>
                <strong className="num">{formatMoney(expenses, currency)}</strong>
                <Change value={expensesChange} goodWhenUp={false} />
              </div>
            </div>

            <div className="hero__stat">
              <span className="hero__stat-icon">
                <Icon name="savings" size={16} />
              </span>
              <div>
                <span className="hero__stat-label">Saved</span>
                <strong className="num">{formatMoney(saved, currency)}</strong>
                <span className="hero__change">this month</span>
              </div>
            </div>
          </div>
        </section>

        <section className="panel donut-panel">
          <div className="panel__head">
            <h2>Where money went</h2>
          </div>

          {categories.length === 0 ? (
            <p className="muted">No expenses this month yet.</p>
          ) : (
            <div className="donut">
              <div className="donut__chart">
                <PieChart width={170} height={170}>
                  <Pie
                    data={categories}
                    dataKey="value"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {categories.map((c) => (
                      <Cell key={c.name} fill={getCategoryColor(c.name)} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="donut__center">
                  <span className="muted">Spent</span>
                  <strong className="num">{formatMoney(expenses, currency)}</strong>
                </div>
              </div>

              <ul className="donut__legend">
                {categories.slice(0, 4).map((c) => (
                  <li key={c.name}>
                    <i style={{ background: getCategoryColor(c.name) }} />
                    <span>{c.name}</span>
                    <b className="num">{Math.round((c.value / expenses) * 100)}%</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <div className="dash-bottom">
        <section className="panel">
          <div className="panel__head">
            <h2>Recent transactions</h2>
            <Link className="text-link" to="/transactions">
              See all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="muted">Nothing here yet. Add your first transaction.</p>
          ) : (
            <ul className="rows">
              {recent.map((t) => (
                <li className="row" key={t.id}>
                  <CategoryBadge category={t.category} />
                  <div className="row__main">
                    <strong>{t.title}</strong>
                    <span className="muted">
                      {t.category}, {formatDate(t.date)}
                    </span>
                  </div>
                  <span className={t.type === "income" ? "num positive" : "num negative"}>
                    {t.type === "income" ? "+" : "−"}
                    {formatMoney(t.amount, currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2>Your wallets</h2>
            <Link className="text-link" to="/wallets">
              Manage
            </Link>
          </div>

          <ul className="rows">
            {wallets.map((w) => {
              const isActive = w.id === selectedWallet.id;
              const icon = WALLET_TYPES.find((t) => t.value === w.type)?.icon;

              return (
                <li key={w.id}>
                  <button
                    type="button"
                    className={isActive ? "wallet-row is-active" : "wallet-row"}
                    onClick={() => setSelectedId(w.id)}
                  >
                    <span className="wallet-row__icon">
                      <Icon name={icon} size={18} />
                    </span>
                    <span className="row__main">
                      <strong>{w.name}</strong>
                      <span className="muted">{isActive ? "Active" : w.currency}</span>
                    </span>
                    <span className="num">
                      {formatMoney(getWalletBalance(w, allTransactions), w.currency)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}


function Change({ value, goodWhenUp }) {
  if (value === null) {
    return <span className="hero__change">no data for last month</span>;
  }

  const isGood = goodWhenUp ? value >= 0 : value <= 0;

  return (
    <span className="hero__change">
      <b className={isGood ? "is-good" : "is-bad"}>
        {value > 0 ? "+" : ""}
        {value}%
      </b>{" "}
      vs last month
    </span>
  );
}

export default Dashboard;
