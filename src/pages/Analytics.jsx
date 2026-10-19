import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import NoWallet from "../components/NoWallet";
import Icon from "../components/Icon";
import { formatMoney, sumByType, dateToString, getCategoryColor } from "../utils";
import "./Analytics.scss";

const PERIODS = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "all", label: "All time" },
];

function shortLabel(key) {
  if (key.length === 7) {
    return new Date(key + "-01T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  return new Date(key + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function compact(value) {
  return value >= 1000 ? `${Math.round(value / 100) / 10}k` : value;
}

function Analytics({ selectedWallet, walletTransactions }) {
  const [period, setPeriod] = useState("30");

  if (!selectedWallet) {
    return (
      <>
        <div className="page-head">
          <h1>Analytics</h1>
        </div>
        <NoWallet />
      </>
    );
  }

  const currency = selectedWallet.currency;
  const days = period === "all" ? null : Number(period);


  let filtered = walletTransactions;
  if (days) {
    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    const fromString = dateToString(from);
    filtered = walletTransactions.filter((t) => t.date >= fromString);
  }

  const income = sumByType(filtered, "income");
  const expenses = sumByType(filtered, "expense");
  const net = income - expenses;


  const byMonth = days === null || days > 31;
  const groups = {};

  
  if (!byMonth) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateToString(d);
      groups[key] = { key, income: 0, expenses: 0 };
    }
  }

  for (const t of filtered) {
    const key = byMonth ? t.date.slice(0, 7) : t.date;
    if (!groups[key]) groups[key] = { key, income: 0, expenses: 0 };
    if (t.type === "income") groups[key].income += t.amount;
    else groups[key].expenses += t.amount;
  }

  const chartData = Object.values(groups)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((g) => ({ ...g, label: shortLabel(g.key) }));

  const byCategory = {};
  for (const t of filtered) {
    if (t.type === "expense") {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  }
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="analytics">
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <p>{selectedWallet.name}</p>
        </div>

        <div className="segmented" role="group" aria-label="Period">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={period === p.value ? "is-active" : ""}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat__icon stat__icon--in">
            <Icon name="arrowDown" size={18} />
          </span>
          <div>
            <span className="muted">Income</span>
            <strong className="num">{formatMoney(income, currency)}</strong>
          </div>
        </div>

        <div className="stat">
          <span className="stat__icon stat__icon--out">
            <Icon name="arrowUp" size={18} />
          </span>
          <div>
            <span className="muted">Expenses</span>
            <strong className="num">{formatMoney(expenses, currency)}</strong>
          </div>
        </div>

        <div className="stat">
          <span className="stat__icon">
            <Icon name="savings" size={18} />
          </span>
          <div>
            <span className="muted">Net result</span>
            <strong className={net < 0 ? "num negative" : "num"}>
              {formatMoney(net, currency)}
            </strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2>Income and expenses</h2>
          <div className="legend">
            <span>
              <i style={{ background: "#1f8a5b" }} /> Income
            </span>
            <span>
              <i style={{ background: "#c4452d" }} /> Expenses
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="muted">No transactions in this period.</p>
        ) : (
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2} margin={{ left: -8, right: 4 }}>
                <CartesianGrid stroke="#e2e7e1" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#667069" }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#667069" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={compact}
                  width={52}
                />
                <Tooltip
                  cursor={{ fill: "rgba(21, 33, 28, 0.05)" }}
                  formatter={(value, name) => [formatMoney(value, currency), name]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #e2e7e1",
                    boxShadow: "none",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#1f8a5b" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="expenses" name="Expenses" fill="#c4452d" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2>Expenses by category</h2>
        </div>

        {categories.length === 0 ? (
          <p className="muted">No expenses in this period.</p>
        ) : (
          <ul className="bars">
            {categories.map(([name, amount]) => (
              <li key={name}>
                <div className="bars__label">
                  <span>{name}</span>
                  <span>
                    <b className="num">{formatMoney(amount, currency)}</b>
                    <span className="muted"> · {Math.round((amount / expenses) * 100)}%</span>
                  </span>
                </div>
                <div className="bars__track">
                  <div
                    className="bars__fill"
                    style={{
                      width: `${(amount / categories[0][1]) * 100}%`,
                      background: getCategoryColor(name),
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Analytics;
