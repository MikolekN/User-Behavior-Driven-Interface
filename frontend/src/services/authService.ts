const API_URL = 'http://127.0.0.1:5000/api';

interface UserResponse {
    login: string;
    email: string;
    account_name: string;
    account_number: string;
    blockades: number;
    balance: number;
    currency: string;
    role: string;
}

interface GetUserResponse {
    user: UserResponse;
}

interface LoginResponse {
    user: UserResponse;
}

interface RegisterResponse {
    message: string;
}

interface UpdateUserResponse {
    user: UserResponse;
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json();
    if (!response.ok) {
        const message = data.message || 'Something went wrong with the API request.';
        console.error(`Error: ${response.status} - ${response.statusText}`, message);
        throw new Error(message);
    }
    return data as T;
};

export const getUserData = async (): Promise<GetUserResponse> => {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        credentials: 'include'
    });
    return handleApiResponse<GetUserResponse>(response);
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });
    return handleApiResponse<LoginResponse>(response);
};

export const registerUser = async (email: string, password: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    return handleApiResponse<RegisterResponse>(response);
};

export const logoutUser = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    await handleApiResponse(response);
};

export const getUserIcon = async (): Promise<Blob> => {
    const response = await fetch(`${API_URL}/user/icon`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        const data = await response.json();
        console.error(`Failed to fetch icon: ${data.message}`, response.status);
        throw new Error(data.message || 'Fetching icon failed');
    }
    return response.blob();
};

export const uploadUserIcon = async (icon: File): Promise<void> => {
    const formData = new FormData();
    formData.append('icon', icon);
    const response = await fetch(`${API_URL}/user/icon`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    await handleApiResponse(response);
};

export const updateUserField = async (field: string, value: string): Promise<UpdateUserResponse> => {
    const response = await fetch(`${API_URL}/user/update`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
    });
    return handleApiResponse<UpdateUserResponse>(response);
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_URL}/user/password`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        })
    });
    await handleApiResponse(response);
};
