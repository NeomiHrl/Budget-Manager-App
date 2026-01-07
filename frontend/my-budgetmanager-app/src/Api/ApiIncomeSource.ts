const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");

export const createIncomeSource = async (incomeSourceData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/income-sources`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeSourceData),
    });
    return response.json();
}

export const getIncomeSources = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/income-sources`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const deleteIncomeSource = async (incomeSourceId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/income-sources/${incomeSourceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}

export const updateIncomeSource = async (incomeSourceId: number, incomeSourceData: any) => {    
    const token = getToken();
    const response = await fetch(`${API_URL}/income-sources/${incomeSourceId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeSourceData),
    });
    return response.json();
}

export const getIncomeSourceById = async (incomeSourceId: number) => {  
    const token = getToken();
    const response = await fetch(`${API_URL}/income-sources/${incomeSourceId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.json();
}