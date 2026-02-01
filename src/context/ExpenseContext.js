import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchExpenses, createExpense } from '../services/api';

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'date_desc'
  });

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(filters);
      setExpenses(data);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const addExpense = async (expenseData) => {
    setLoading(true);
    setError(null);
    try {
      const newExpense = await createExpense(expenseData);
      // Reload expenses to get the updated list from server
      await loadExpenses();
      return newExpense;
    } catch (err) {
      setError(err.message || 'Failed to create expense');
      console.error('Error creating expense:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate total of visible expenses
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  const value = {
    expenses,
    loading,
    error,
    filters,
    total,
    addExpense,
    updateFilters,
    refreshExpenses: loadExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
