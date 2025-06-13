import api from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Utility to fetch CSRF token after login
declare global {
  interface Window { ensureCsrfToken?: () => Promise<void>; }
}

function deleteCookie(name: string) {
  document.cookie = name + '=; Max-Age=0; path=/;';
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function fetchCsrfAfterLogin() {
  console.log('[DEBUG] Calling /csrf after login...');
  deleteCookie('XSRF-TOKEN');
  await sleep(200); // Wait for new JSESSIONID cookie to be set
  
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch('http://localhost:8080/csrf', { 
      credentials: 'include',
      headers
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch CSRF token: ${res.status}`);
    }
    const data = await res.json();
    console.log('[DEBUG] /csrf response:', data);
  } catch (error) {
    console.error('[DEBUG] Error fetching CSRF token:', error);
    throw error;
  }
}

async function fetchCsrfTokenForSession() {
  await fetch('http://localhost:8080/csrf', { credentials: 'include' });
}

const userService = {
  /**
   * Register a new user
   */
  register: async (userData: UserCreateDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    await fetchCsrfTokenForSession();
    
    return response;
  },
  
  /**
   * Login a user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    // Always fetch CSRF token after login
    await fetchCsrfAfterLogin();
    
    await fetchCsrfTokenForSession();
    
    return response;
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },
  
  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/users/me');
  },
  
  /**
   * Get a user by ID (admin)
   */
  getUserById: async (userId: string): Promise<User> => {
    return api.get<User>(`/users/${userId}`);
  },
  
  /**
   * Update a user's profile
   */
  updateUser: async (userId: string, userData: UserUpdateDTO): Promise<User> => {
    return api.patch<User>(`/users/${userId}`, userData);
  },
  
  /**
   * List all users (admin)
   */
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<UserListResponse> => {
    return api.get<UserListResponse>(`/users?page=${page}&limit=${limit}`);
  },
  
  /**
   * Delete a user (admin)
   */
  deleteUser: async (userId: string): Promise<void> => {
    return api.delete<void>(`/users/${userId}`);
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  }
};

export default userService; 