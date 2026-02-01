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
    sort: 'date_desc',
    page: 1,
    limit: 5
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0
  });

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchExpenses(filters);
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 5;

      const expensesData = Array.isArray(response)
        ? response
        : (response?.data ?? response?.expenses ?? response?.items ?? response?.results ?? []);
      const dataArray = Array.isArray(expensesData) ? expensesData : [];
      setExpenses(dataArray);

      const total = response?.total ?? response?.totalCount ?? response?.count ?? response?.totalElements;
      const responseLimit = response?.limit ?? response?.pageSize ?? response?.size ?? limit;

      if (typeof total === 'number') {
        const effectiveLimit = responseLimit || limit;
        const totalPages = Math.ceil(total / effectiveLimit) || 1;
        const responsePage = response?.page ?? response?.currentPage ?? (response?.number !== undefined ? response.number + 1 : page);
        setPagination({
          total,
          page: responsePage,
          limit: effectiveLimit,
          totalPages
        });
      } else {
        const totalPages = dataArray.length >= limit ? Math.max(page + 1, 2) : page;
        setPagination({
          total: dataArray.length + (page - 1) * limit,
          page,
          limit,
          totalPages
        });
      }
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
    setFilters(prev => {
      const next = { ...prev, ...newFilters };
      if ('category' in newFilters || 'sort' in newFilters || 'limit' in newFilters) {
        next.page = 1;
      }
      return next;
    });
  };

  // Calculate total of visible expenses
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  const value = {
    expenses,
    loading,
    error,
    filters,
    pagination,
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
