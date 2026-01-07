const API_URL = 'http://localhost:5000';

export const getToken=()=> localStorage.getItem("token");

export const registerUser = async (userData: any) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
};

export const loginUser = async (userData: any) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
};

export const getUserById = async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
    }
    return data;
};

export const getUsers = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
    }
    return data;
};

export const updateUser = async (userId: number, userData: any) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),     
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
    }
    return data;
};

export const deleteUser = async (userId: number) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, 
        },
    });
    let data=await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
    }
    return data;
};
 
export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
    }
    return data;
};

// resetPassword מקבל { token, new_password }
export const resetPassword = async (payload: { token: string; new_password: string }) => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    let data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
    }
    return data;
};

export const checkToken = async () => {
    const token = getToken();
    if (!token) return false;
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.ok;
};