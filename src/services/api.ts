// Base configuration for API requests
const API_BASE_URL = 'http://localhost:8080';

// Utility to get a cookie value by name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// Ensure CSRF token is present in cookies, but do NOT fetch /csrf here
async function ensureCsrfToken() {
  if (!getCookie('XSRF-TOKEN')) {
    // Fetch CSRF token if missing
    const response = await fetch('http://localhost:8080/csrf', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    // Update the CSRF token in the cookie
    const csrfToken = response.headers.get('X-XSRF-TOKEN');
    if (csrfToken) {
      document.cookie = `XSRF-TOKEN=${csrfToken}; path=/`;
    }
  }
}

/**
 * Generic request handler with error management
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Always add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // For mutating requests, ensure CSRF token is present and attach it
  const method = (options.method || 'GET').toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    await ensureCsrfToken();
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken;
    }
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.headers || {}),
        ...headers,
      },
    });

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export default {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: JSON.stringify(data) 
    }),
  
  put: <T>(endpoint: string, data: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: JSON.stringify(data) 
    }),
  
  patch: <T>(endpoint: string, data: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PATCH',
      body: JSON.stringify(data) 
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'DELETE' 
    }),
};