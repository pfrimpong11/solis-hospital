import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// A simple utility for making API requests
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers, can be extended
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json().catch(() => ({
        message: 'An unknown error occurred',
      }));
      toast.error(errorData.message || 'Something went wrong');
      throw new Error(errorData.message);
    }

    // Handle successful responses
    if (response.status === 204) {
      // No content to parse
      return null;
    }

    return await response.json();
  } catch (error) {
    // Handle network errors or other issues
    console.error('API fetch error:', error);
    toast.error('Network error, please try again.');
    throw error;
  }
}

// GET request helper
export const get = (endpoint: string, options: RequestInit = {}) =>
  apiFetch(endpoint, { ...options, method: 'GET' });

// POST request helper
export const post = (endpoint: string, body: any, options: RequestInit = {}) =>
  apiFetch(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

// PUT request helper
export const put = (endpoint: string, body: any, options: RequestInit = {}) =>
  apiFetch(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

// DELETE request helper
export const del = (endpoint: string, options: RequestInit = {}) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' }); 