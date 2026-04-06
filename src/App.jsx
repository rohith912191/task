import { useEffect, useMemo, useState, useReducer } from 'react';
import RolePanel from './components/RolePanel.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import ChartsPanel from './components/ChartsPanel.jsx';
import TransactionsPanel from './components/TransactionsPanel.jsx';
import InsightsPanel from './components/InsightsPanel.jsx';
import { Moon, Sun, Download, Wallet } from 'lucide-react';
import './styles.css';

const initialTransactions = [
  { id: 1, date: '2026-04-01', amount: 4200, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: 2, date: '2026-04-03', amount: 65, category: 'Coffee', type: 'expense', description: 'Morning espresso' },
  { id: 3, date: '2026-04-05', amount: 140, category: 'Groceries', type: 'expense', description: 'Weekly market' },
  { id: 4, date: '2026-04-08', amount: 380, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  { id: 5, date: '2026-04-10', amount: 980, category: 'Freelance', type: 'income', description: 'Client project' },
  { id: 6, date: '2026-04-12', amount: 220, category: 'Transport', type: 'expense', description: 'Gas and commute' },
  { id: 7, date: '2026-04-14', amount: 315, category: 'Dining', type: 'expense', description: 'Dinner with friends' },
  { id: 8, date: '2026-04-18', amount: 120, category: 'Subscription', type: 'expense', description: 'Streaming services' },
  { id: 9, date: '2026-04-22', amount: 1550, category: 'Bonus', type: 'income', description: 'Performance bonus' },
  { id: 10, date: '2026-04-24', amount: 270, category: 'Health', type: 'expense', description: 'Pharmacy and doctor' }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Action types for reducer
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

// Reducer for transactions
function transactionsReducer(state, action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return [...state, action.payload];
    case DELETE_TRANSACTION:
      return state.filter(t => t.id !== action.payload);
    case UPDATE_TRANSACTION:
      return state.map(t => t.id === action.payload.id ? action.payload : t);
    default:
      return state;
  }
}

function App() {
  const [transactions, dispatch] = useReducer(transactionsReducer, initialTransactions);
  const [role, setRole] = useState('Viewer');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-dashboard-transactions');
    const savedTheme = localStorage.getItem('finance-dashboard-theme');
    const savedRole = localStorage.getItem('finance-dashboard-role');

    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        parsed.forEach(t => dispatch({ type: ADD_TRANSACTION, payload: t }));
      } catch (e) {
        console.error('Failed to load transactions:', e);
      }
    }

    if (savedTheme) setTheme(savedTheme);
    if (savedRole) setRole(savedRole);
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-dashboard-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('finance-dashboard-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finance-dashboard-role', role);
  }, [role]);

  const filteredTransactions = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const filtered = transactions.filter((item) => {
      const matchesText =
        normalized.length === 0 ||
        item.category.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesText && matchesType;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      const timestampA = new Date(a.date).getTime();
      const timestampB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? timestampA - timestampB : timestampB - timestampA;
    });

    return sorted;
  }, [transactions, search, typeFilter, sortKey, sortDirection]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      balance: income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  const summary = useMemo(() => {
    const categories = transactions.reduce((map, item) => {
      if (item.type === 'expense') {
        map[item.category] = (map[item.category] || 0) + item.amount;
      }
      return map;
    }, {});

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0] || ['No expenses', 0];

    const monthlyNet = transactions.reduce((acc, item) => {
      const month = new Date(item.date).toLocaleString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + item.amount * (item.type === 'income' ? 1 : -1);
      return acc;
    }, {});

    const monthlyComparison = Object.entries(monthlyNet)
      .sort(([a], [b]) => new Date(`${a} 1`) - new Date(`${b} 1`))
      .map(([month, value]) => ({ month, value }));

    return {
      categoryTotals: categories,
      topCategory,
      monthlyComparison
    };
  }, [transactions]);

  const trendPoints = useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const uniqueDates = Array.from(new Set(sortedTransactions.map((item) => item.date)));
    let runningBalance = 0;

    return uniqueDates.slice(-6).map((date) => {
      const dailyChange = sortedTransactions
        .filter((item) => item.date === date)
        .reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0);

      runningBalance += dailyChange;

      return {
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: runningBalance
      };
    });
  }, [transactions]);

  const handleAddTransaction = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      const id = transactions.length ? Math.max(...transactions.map((item) => item.id)) + 1 : 1;
      dispatch({ type: ADD_TRANSACTION, payload: { id, ...data } });
      setIsLoading(false);
    }, 500); // Simulate async operation
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="header-main">
          <div className="logo-section">
            <div className="logo-icon">
              <Wallet size={24} />
            </div>
            <div>
              <p className="eyebrow">Personal finance dashboard</p>
              <h1>Finance snapshot</h1>
            </div>
          </div>
          <p className="subtitle">
            Clean, interactive data views for monthly spending, income, and financial performance.
          </p>
          <p className="developer-tagline">
            Built and maintained by Aggannagqri Rohith Reddy — CSE undergraduate focused on Python, web development, and machine learning.
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="theme-switcher"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="button-text">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button
            type="button"
            className="export-button"
            onClick={exportToCSV}
            title="Export transactions to CSV"
          >
            <Download size={16} />
            <span className="button-text">Export</span>
          </button>
          <RolePanel role={role} onRoleChange={setRole} />
        </div>
      </header>

      <main>
        <SummaryCards totals={totals} formatCurrency={formatCurrency} />

        <ChartsPanel
          trendPoints={trendPoints}
          formatCurrency={formatCurrency}
          categoryTotals={summary.categoryTotals}
        />

        <section className="section-grid">
          <TransactionsPanel
            role={role}
            transactions={filteredTransactions}
            rawTransactions={transactions}
            onAddTransaction={handleAddTransaction}
            search={search}
            setSearch={setSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            formatCurrency={formatCurrency}
            isLoading={isLoading}
          />
          <InsightsPanel
            totals={totals}
            topCategory={summary.topCategory}
            monthlyComparison={summary.monthlyComparison}
            formatCurrency={formatCurrency}
          />
        </section>
      </main>

      <footer className="app-footer">
        <div>
          <p className="footer-title">Aggannagqri Rohith Reddy</p>
          <p>Computer Science undergraduate | Python, Web Development, Machine Learning</p>
        </div>
        <div className="footer-links">
          <a href="mailto:rohith912191@gmail.com">rohith912191@gmail.com</a>
          <a href="tel:+919121916107">+91 91219 6107</a>
          <a href="https://github.com/rohith912191" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://portfolio1-smoky-omega.vercel.app/" target="_blank" rel="noreferrer">Portfolio</a>
          <a href="https://www.linkedin.com/in/rohith-reddy91/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
