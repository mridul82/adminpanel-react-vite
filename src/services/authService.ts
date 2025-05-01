import api from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
  [key: string]: any; // Allow for additional properties
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Authentication service
const authService = {
  // Register a new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting registration with:', { ...data, password: '******', password_confirmation: '******' });

      // No need to get CSRF token for this API

      const response = await api.post('/register', data);

      console.log('Raw registration response:', response);
      console.log('Registration response data:', response.data);

      // Log the entire response structure for debugging
      console.log('Full registration response structure:', JSON.stringify(response.data, null, 2));

      // Check for different token formats in Laravel response
      let token = '';
      if (response.data.token) {
        token = response.data.token;
      } else if (response.data.access_token) {
        token = response.data.access_token;
      } else if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
      } else if (response.data.data && response.data.data.access_token) {
        token = response.data.data.access_token;
      } else if (response.data.authorization && response.data.authorization.token) {
        token = response.data.authorization.token;
      } else if (typeof response.data === 'string' && response.data.includes('token')) {
        // Try to parse if it's a string containing JSON
        try {
          const parsedData = JSON.parse(response.data);
          token = parsedData.token || parsedData.access_token || '';
        } catch (e) {
          console.error('Failed to parse response string:', e);
        }
      }

      // Extract user data from different possible formats
      let userData = null;
      if (response.data.user) {
        userData = response.data.user;
      } else if (response.data.data && response.data.data.user) {
        userData = response.data.data.user;
      } else if (response.data.data && response.data.data.id) {
        userData = response.data.data;
      } else if (response.data.id && response.data.email) {
        userData = response.data;
      }

      // Create a properly formatted AuthResponse
      const authResponse: AuthResponse = {
        token: token,
        user: userData || {},
        message: response.data.message || 'Registration successful'
      };

      console.log('Formatted auth response:', authResponse);

      // Make sure we have a token
      if (!authResponse.token) {
        console.error('No token found in registration response.');
        throw new Error('Registration failed: No token received from the server. Please check your Laravel Sanctum configuration.');
      }

      if (!authResponse.user) {
        console.error('No user data in response');

        // If we have a token but no user, try to fetch the user data
        if (authResponse.token) {
          try {
            // Store the token first
            localStorage.setItem('token', authResponse.token);

            // Then fetch the user data
            const userResponse = await api.get('/user');
            console.log('User data fetch response:', userResponse.data);

            if (userResponse.data.user) {
              authResponse.user = userResponse.data.user;
            } else if (userResponse.data) {
              // Some APIs return the user directly
              authResponse.user = userResponse.data;
            }
          } catch (userError) {
            console.error('Error fetching user data after registration:', userError);
          }
        }

        // If we still don't have user data, throw an error
        if (!authResponse.user || !authResponse.user.id) {
          throw new Error('Registration failed: No user data received');
        }
      }

      // Store token and user data
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));

      return authResponse;
    } catch (error: any) {
      console.error('Registration error:', error);

      // Format error message for display
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', credentials);

      // No need to get CSRF token for this API

      const response = await api.post('/login', credentials);

      console.log('Raw login response:', response);
      console.log('Login response data:', response.data);

      // Log the entire response structure for debugging
      console.log('Full response structure:', JSON.stringify(response.data, null, 2));

      // Check for token in Laravel response
      // For Laravel Sanctum, the token is typically in response.data.token
      let token = '';

      // Direct check for token in the response
      if (response.data.token) {
        token = response.data.token;
        console.log('Found token in response.data.token');
      } else if (response.data.access_token) {
        token = response.data.access_token;
        console.log('Found token in response.data.access_token');
      } else {
        // Log the response structure to help debug
        console.log('Token not found in expected locations. Response structure:', response.data);

        // Try to find the token in other common locations
        if (response.data.data?.token) {
          token = response.data.data.token;
          console.log('Found token in response.data.data.token');
        } else if (response.data.data?.access_token) {
          token = response.data.data.access_token;
          console.log('Found token in response.data.data.access_token');
        } else if (response.data.authorization?.token) {
          token = response.data.authorization.token;
          console.log('Found token in response.data.authorization.token');
        }
      }

      // Extract user data from different possible formats
      let userData = null;

      // For Laravel Sanctum, the user data is typically in response.data.user
      if (response.data.user) {
        userData = response.data.user;
        console.log('Found user data in response.data.user');
      } else if (response.data.data?.user) {
        userData = response.data.data.user;
        console.log('Found user data in response.data.data.user');
      } else if (response.data.data?.id) {
        userData = response.data.data;
        console.log('Found user data in response.data.data');
      } else if (response.data.id && response.data.email) {
        userData = response.data;
        console.log('Found user data directly in response.data');
      } else {
        console.log('User data not found in expected locations. Will try to fetch separately.');
      }

      // Create a properly formatted AuthResponse
      const authResponse: AuthResponse = {
        token: token,
        user: userData || {},
        message: response.data.message || 'Login successful'
      };

      console.log('Formatted auth response:', authResponse);

      // Make sure we have a token
      if (!authResponse.token) {
        console.error('No token found in response.');
        throw new Error('Authentication failed: No token received from the server. Please check your Laravel Sanctum configuration.');
      }

      if (!authResponse.user) {
        console.error('No user data in response');

        // If we have a token but no user, try to fetch the user data
        if (authResponse.token) {
          try {
            // Store the token first
            localStorage.setItem('token', authResponse.token);

            // Then fetch the user data from the /me endpoint
            const userResponse = await api.get('/me');
            console.log('User data fetch response:', userResponse.data);

            if (userResponse.data.user) {
              authResponse.user = userResponse.data.user;
              console.log('Found user data in userResponse.data.user');
            } else if (userResponse.data.id && userResponse.data.email) {
              // Some APIs return the user directly
              authResponse.user = userResponse.data;
              console.log('Found user data directly in userResponse.data');
            } else if (userResponse.data.data?.id) {
              authResponse.user = userResponse.data.data;
              console.log('Found user data in userResponse.data.data');
            }
          } catch (userError) {
            console.error('Error fetching user data after login:', userError);
          }
        }

        // If we still don't have user data, throw an error
        if (!authResponse.user || !authResponse.user.id) {
          throw new Error('Authentication failed: No user data received');
        }
      }

      // Store token and user data
      localStorage.setItem('token', authResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));

      return authResponse;
    } catch (error: any) {
      console.error('Login error:', error);

      // Format error message for display
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      // No need to get CSRF token for this API

      await api.post('/logout');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Local storage cleared');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('Fetching current user...');
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No token found, skipping user fetch');
        return null;
      }

      // No need to get CSRF token for this API

      const response = await api.get('/me');
      console.log('Current user response:', response);
      console.log('Current user data:', response.data);

      let userData: User | null = null;

      // Handle different API response formats
      if (response.data.user) {
        // Format: { user: {...} }
        userData = response.data.user;
      } else if (response.data.id) {
        // Format: { id: ..., name: ..., email: ... }
        userData = response.data;
      } else if (response.data.data && response.data.data.id) {
        // Format: { data: { id: ..., name: ..., email: ... } }
        userData = response.data.data;
      }

      if (userData) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      console.error('Could not extract user data from response:', response.data);
      return null;
    } catch (error: any) {
      console.error('Error fetching current user:', error);

      // If unauthorized, clear storage
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      return null;
    }
  },

  // Request password reset
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/forgot-password', data);
    return response.data;
  },

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/reset-password', data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Get stored user
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
