const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");

export const createExpenseSource = async (expenseSourceData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expense-sources`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseSourceData),
    });
    return response.json();
}

export const getExpenseSources = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expense-sources`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const deleteExpenseSource = async (expenseSourceId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expense-sources/${expenseSourceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const updateExpenseSource = async (expenseSourceId: number, expenseSourceData: any) => {    
    const token = getToken();
    const response = await fetch(`${API_URL}/expense-sources/${expenseSourceId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseSourceData),
    });
    return response.json();
}

export const getExpenseSourceById = async (expenseSourceId: number) => {  
    const token = getToken();
    const response = await fetch(`${API_URL}/expense-sources/${expenseSourceId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}