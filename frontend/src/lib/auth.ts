import { useEffect, useState } from 'react';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the access token from cookies when the component mounts
    const token = getCookie('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Helper function to get the value of a cookie by name
  const getCookie = (name: string) => {
    const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    if (match) {
      return match.split('=')[1];
    }
    return null;
  };

  // Helper function to set cookies securely
  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiry time
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; Secure; HttpOnly; SameSite=Strict`;
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return;

    try {
      const response = await fetch('/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Update the access token in cookies and state
      setCookie('accessToken', newAccessToken, 7);  // 7 days expiration (adjust as needed)
      setAccessToken(newAccessToken);

    } catch (error) {
      console.error('Error refreshing token:', error);
      logout(); // Optionally log out if refreshing fails
    }
  };

  // Check if the access token is valid (i.e., not expired)
  const isTokenValid = () => {
    if (!accessToken) return false;
    const payload = JSON.parse(atob(accessToken.split('.')[1])); // Decode the JWT token
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return expiry > Date.now();
  };

  // Logout: Clear cookies
  const logout = () => {
    document.cookie = 'accessToken=; Max-Age=0; path=/; Secure; HttpOnly; SameSite=Strict';
    document.cookie = 'refreshToken=; Max-Age=0; path=/; Secure; HttpOnly; SameSite=Strict';
  };

  // Automatically refresh the token if it's expired
  const getValidAccessToken = async () => {
    if (!accessToken || !isTokenValid()) {
      await refreshAccessToken();
    }
    return accessToken;
  };

  return {
    accessToken,
    setAccessToken,
    refreshAccessToken,
    isTokenValid,
    logout,
    getValidAccessToken, // Return this to ensure the access token is valid
  };
};

export default useAuth;
