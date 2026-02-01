import { ExpenseProvider } from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <div className="app">
        <header className="app-header">
          <h1>Fenmo Expense Tracker</h1>
          <p className="app-subtitle">Track and manage your expenses efficiently</p>
        </header>
        
        <main className="app-main">
          <div className="container">
            <ExpenseForm />
            <ExpenseList />
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Fenmo Expense Tracker</p>
        </footer>
      </div>
    </ExpenseProvider>
  );
}

export default App;
