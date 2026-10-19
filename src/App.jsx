import { Routes, Route, Navigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import { sampleWallets, sampleTransactions } from "./data/sampleData";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Wallets from "./pages/Wallets";

function App() {
  const [wallets, setWallets] = useLocalStorage("fd-wallets", sampleWallets);
  const [transactions, setTransactions] = useLocalStorage(
    "fd-transactions",
    sampleTransactions
  );
  const [selectedId, setSelectedId] = useLocalStorage("fd-selected-wallet", "w1");

  const selectedWallet =
    wallets.find((w) => w.id === selectedId) || wallets[0] || null;

  const walletTransactions = selectedWallet
    ? transactions.filter((t) => t.walletId === selectedWallet.id)
    : [];

  const shared = {
    wallets,
    selectedWallet,
    setSelectedId,
    walletTransactions,
    allTransactions: transactions,
  };

  return (
    <div className="layout">
      <Sidebar
        wallets={wallets}
        selectedWallet={selectedWallet}
        transactions={transactions}
        onSelectWallet={setSelectedId}
      />

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard {...shared} />} />
          <Route
            path="/transactions"
            element={
              <Transactions
                {...shared}
                setTransactions={setTransactions}
              />
            }
          />
          <Route path="/analytics" element={<Analytics {...shared} />} />
          <Route
            path="/wallets"
            element={
              <Wallets
                {...shared}
                setWallets={setWallets}
                setTransactions={setTransactions}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
