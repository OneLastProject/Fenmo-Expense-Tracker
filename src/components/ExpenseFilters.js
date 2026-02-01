import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import './ExpenseFilters.css';

const ExpenseFilters = () => {
  const { filters, updateFilters } = useExpenses();
  const [categoryInput, setCategoryInput] = useState(filters.category || '');

  const handleCategoryChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleCategoryFilter = () => {
    updateFilters({ category: categoryInput.trim() });
  };

  const handleClearCategory = () => {
    setCategoryInput('');
    updateFilters({ category: '' });
  };

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCategoryFilter();
    }
  };

  return (
    <div className="expense-filters">
      <div className="filter-group">
        <label htmlFor="category-filter">Filter by Category:</label>
        <div className="filter-input-group">
          <input
            type="text"
            id="category-filter"
            value={categoryInput}
            onChange={handleCategoryChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter category name"
          />
          <button 
            onClick={handleCategoryFilter}
            className="filter-button"
          >
            Apply
          </button>
          {filters.category && (
            <button 
              onClick={handleClearCategory}
              className="clear-button"
            >
              Clear
            </button>
          )}
        </div>
        {filters.category && (
          <div className="active-filter">
            Active filter: <strong>{filters.category}</strong>
          </div>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={filters.sort}
          onChange={handleSortChange}
        >
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
        </select>
      </div>
    </div>
  );
};

export default ExpenseFilters;
