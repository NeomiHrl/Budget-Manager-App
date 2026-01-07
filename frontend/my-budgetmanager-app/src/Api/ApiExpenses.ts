const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");

export const createExpense = async (expenseData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    });
    return response.json();
};

export const getExpenses = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const updateExpense = async (expenseId: number, expenseData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    });
    return response.json();
};

export const deleteExpense = async (expenseId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const getExpenseById = async (expenseId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const getExpensesByUserId = async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/expenses/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}
