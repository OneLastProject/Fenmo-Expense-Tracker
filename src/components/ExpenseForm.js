import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import './ExpenseForm.css';

const ExpenseForm = () => {
  const { addExpense, loading } = useExpenses();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user modifies the form
    setFormError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0');
      return false;
    }
    if (!formData.category.trim()) {
      setFormError('Please enter a category');
      return false;
    }
    if (!formData.description.trim()) {
      setFormError('Please enter a description');
      return false;
    }
    if (!formData.date) {
      setFormError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (submitting) {
      return;
    }

    setFormError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await addExpense(formData);
      
      setSuccessMessage('Expense added successfully!');
      
      // Reset form after successful submission
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError(error.message || 'Failed to add expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Food, Transport, Entertainment"
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the expense"
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </div>

        {formError && (
          <div className="message error-message">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="message success-message">
            {successMessage}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting || loading}
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
