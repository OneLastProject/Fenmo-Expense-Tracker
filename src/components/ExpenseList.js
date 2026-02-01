import { useExpenses } from '../context/ExpenseContext';
import ExpenseFilters from './ExpenseFilters';
import './ExpenseList.css';

const ExpenseList = () => {
  const { expenses, loading, error, total } = useExpenses();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="expense-list-container">
      <h2>Expenses</h2>
      
      <ExpenseFilters />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-message">
          Loading expenses...
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="empty-message">
          No expenses found. Add your first expense above!
        </div>
      )}

      {!loading && !error && expenses.length > 0 && (
        <>
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="amount-column">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>
                      <span className="category-badge">
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description}</td>
                    <td className="amount-column">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-section">
            <div className="total-label">Total:</div>
            <div className="total-amount">{formatCurrency(total)}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;
