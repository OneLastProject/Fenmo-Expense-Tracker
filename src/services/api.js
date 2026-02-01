const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const fetchExpenses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('category', filters.category || '');
    params.append('sort', filters.sort || 'date_desc');
    params.append('page', String(filters.page ?? 1));
    params.append('limit', String(filters.limit ?? 5));

    const url = `${API_BASE_URL}/expenses?${params.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};


export const createExpense = async (expenseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

