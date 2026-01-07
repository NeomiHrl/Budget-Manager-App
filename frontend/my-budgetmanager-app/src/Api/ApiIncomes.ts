const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");

export const createIncome = async (incomeData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
    });
    return response.json();
};

export const getIncomes = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const updateIncome = async (incomeId: number, incomeData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes/${incomeId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
    });
    return response.json();
};

export const deleteIncome = async (incomeId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes/${incomeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const getIncomeById = async (incomeId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes/${incomeId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const getIncomesByUserId = async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/incomes/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}
