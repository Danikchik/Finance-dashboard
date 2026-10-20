# Finance Dashboard

A personal finance dashboard for tracking wallets, income and expenses. Built with React, SCSS and Recharts. No backend: all data stays in your browser.

**Live demo:** https://finance-dashboard-three-olive.vercel.app/

> This is a portfolio project. Please don't enter real financial data.


## Features

- **Dashboard** with the current balance, income, expenses and savings for the month (with a comparison to the previous month), a donut chart of spending by category, the latest transactions and a quick wallet switcher.
- **Transactions** grouped by day (Today, Yesterday, ...) with search, a type filter (All / Income / Expenses) and sorting. Add and edit them in a dialog, delete them with a confirmation, and undo a deletion from the toast.
- **Analytics** for 7, 30 or 90 days or all time: income, expenses and net result, a bar chart by day or month, and expenses by category.
- **Wallets** of four types (bank account, cash, card, savings) in three currencies (USD, EUR, UZS), each with a starting balance. Deleting a wallet can be undone, and its transactions come back with it.
- **Responsive layout**: a sidebar on desktop, a top bar with a bottom tab bar on mobile, and dialogs that become bottom sheets on small screens.
- **Persistent data**: everything is saved in `localStorage`, so a page refresh doesn't reset anything. Sample data is added on the first visit.

## Tech stack

- [React 19](https://react.dev) with hooks
- [React Router 7](https://reactrouter.com) for routing
- [Recharts](https://recharts.org) for charts
- [Sass (SCSS)](https://sass-lang.com) with design tokens and mixins
- [Vite](https://vite.dev) for development and builds
- ESLint with the React Hooks rules

## Getting started

You need [Node.js](https://nodejs.org) 20.19 or newer (or 22.12+).

```bash
git clone https://github.com/YOUR-USERNAME/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

### Resetting the data

The app stores its data in your browser under the keys `fd-wallets`, `fd-transactions` and `fd-selected-wallet`. To start over, clear the site data in your browser settings, or run `localStorage.clear()` in the console and reload the page.

## Project structure

```
src/
  App.jsx                  State (wallets, transactions) and routes
  main.jsx                 Entry point, router and toast provider
  utils.js                 Formatting, balance calculations, category colors
  data/sampleData.js       Demo data for the first visit
  hooks/useLocalStorage.js useState that saves its value in localStorage
  styles/
    _tokens.scss           Colors, fonts, radii, breakpoints, mixins
    global.scss            Base styles, buttons, form fields, shared classes
  components/              Sidebar, Modal, ConfirmDialog, TransactionDialog,
                           WalletDialog, toasts, icons, category badge
  pages/                   Dashboard, Transactions, Analytics, Wallets
```

## Design decisions

- **The balance is calculated, not stored.** A wallet keeps only its starting balance. The current balance is that amount plus income minus expenses, so editing or deleting a transaction can never leave the balance out of sync.
- **State lives in `App.jsx`.** The app is small, so state is lifted to one place and passed down as props. Toasts use React context because any component can show one.
- **Dates are `YYYY-MM-DD` strings.** They sort correctly as plain strings and avoid time zone shifts that come with `Date` objects.
- **Design tokens in SCSS.** Colors, radii and breakpoints are defined once in `_tokens.scss`. Category colors come from one map in `utils.js`.
- **Undo instead of "are you sure" only.** Deleting asks for confirmation and then offers an undo, which is friendlier than a confirmation alone.

## Known limitations and ideas

- There is no backend. Data is local to one browser, and two open tabs don't sync with each other.
- Money is handled as JavaScript numbers. A production app should store amounts as integer cents.
- There are no automated tests yet. The calculations in `utils.js` are the first candidates.
- The dialogs close with Escape and a click outside, but they don't trap keyboard focus yet.
- Planned ideas: a REST API layer with optimistic updates, TypeScript, budgets per category, CSV export.

## Deployment

The app is a static site, so any static host works. `vercel.json` and `public/_redirects` make direct links like `/transactions` work on Vercel and Netlify.
