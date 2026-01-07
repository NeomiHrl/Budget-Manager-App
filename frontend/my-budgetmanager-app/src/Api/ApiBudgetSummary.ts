const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");


export const createBudget = async (budgetData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/budget_summary`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
    });
    return response.json();
};


export const getBudgetSummary = async (userId: number, month: string) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/budget_summary/${userId}/${month}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}


export const updateBudget = async (budgetId: number, budgetData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/budget_summary/${budgetId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },  
        body: JSON.stringify(budgetData),
    });
    return response.json();
}   ;

export const deleteBudget = async (budgetId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/budget/${budgetId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const get_all_budget_summaries = async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/budget_summary/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}