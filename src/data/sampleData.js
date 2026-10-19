import { dateToString } from "../utils";


function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return dateToString(date);
}

export const sampleWallets = [
  { id: "w1", name: "Main card", type: "card", currency: "USD", startBalance: 1500 },
  { id: "w2", name: "Cash", type: "cash", currency: "USD", startBalance: 200 },
];

export const sampleTransactions = [
  { id: "t1", walletId: "w1", title: "Salary", amount: 3200, category: "Salary", type: "income", date: daysAgo(2) },
  { id: "t2", walletId: "w1", title: "Groceries", amount: 86.4, category: "Food", type: "expense", date: daysAgo(1) },
  { id: "t3", walletId: "w1", title: "Rent", amount: 900, category: "Housing", type: "expense", date: daysAgo(4) },
  { id: "t4", walletId: "w1", title: "Metro card", amount: 25, category: "Transport", type: "expense", date: daysAgo(6) },
  { id: "t5", walletId: "w1", title: "Cinema", amount: 18, category: "Entertainment", type: "expense", date: daysAgo(9) },
  { id: "t6", walletId: "w1", title: "Freelance project", amount: 450, category: "Other", type: "income", date: daysAgo(12) },
  { id: "t7", walletId: "w1", title: "Pharmacy", amount: 32.5, category: "Health", type: "expense", date: daysAgo(15) },
  { id: "t8", walletId: "w1", title: "Sneakers", amount: 120, category: "Shopping", type: "expense", date: daysAgo(20) },
  { id: "t9", walletId: "w1", title: "Salary", amount: 3200, category: "Salary", type: "income", date: daysAgo(33) },
  { id: "t10", walletId: "w1", title: "Rent", amount: 900, category: "Housing", type: "expense", date: daysAgo(34) },
  { id: "t11", walletId: "w1", title: "Groceries", amount: 140, category: "Food", type: "expense", date: daysAgo(38) },
  { id: "t12", walletId: "w2", title: "Lunch", amount: 12, category: "Food", type: "expense", date: daysAgo(3) },
  { id: "t13", walletId: "w2", title: "Taxi", amount: 9.5, category: "Transport", type: "expense", date: daysAgo(7) },
];
