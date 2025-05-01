import authService, { User } from '@/services/authService';
import { hasPermission as checkPermission } from '@/types/permission';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Checking authentication status...');

        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          console.log('Token found, user is authenticated');

          // First try to get user from localStorage for immediate UI update
          const storedUser = authService.getUser();
          if (storedUser) {
            console.log('User found in localStorage:', storedUser);
            setUser(storedUser);
          }

          // Then try to get fresh user data from API
          try {
            console.log('Fetching fresh user data from API...');
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
              console.log('Fresh user data received from API:', currentUser);
              setUser(currentUser);
            } else if (!storedUser) {
              console.log('No user data from API and no stored user');
              // If we have a token but couldn't get user data, clear auth state
              authService.logout();
            }
          } catch (apiError) {
            console.error('Error fetching user data from API:', apiError);
            // If API call fails but we have stored user data, keep using that
            if (!storedUser) {
              console.log('API error and no stored user, logging out');
              authService.logout();
            }
          }
        } else {
          console.log('No token found, user is not authenticated');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });

      console.log('Login response in AuthContext:', response);

      if (response) {
        // Check if we have user data in the response
        if (response.user && (response.user.id || response.user.email)) {
          setUser(response.user);
          console.log('User set in AuthContext from response:', response.user);
          return true;
        }
        // If we have a token but no user data, try to get the user from localStorage
        else if (response.token) {
          console.log('No user in response, checking localStorage...');
          const storedUser = authService.getUser();

          if (storedUser) {
            setUser(storedUser);
            console.log('User set in AuthContext from localStorage:', storedUser);
            return true;
          }
          // If still no user, try to fetch it from the API
          else {
            console.log('No user in localStorage, fetching from API...');
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                setUser(currentUser);
                console.log('User set in AuthContext from API:', currentUser);
                return true;
              }
            } catch (fetchError) {
              console.error('Error fetching user after login:', fetchError);
            }
          }
        }

        console.error('Login response missing valid user data');
        return false;
      } else {
        console.error('Invalid login response');
        return false;
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      console.log('Register response in AuthContext:', response);

      if (response) {
        // Check if we have user data in the response
        if (response.user && (response.user.id || response.user.email)) {
          setUser(response.user);
          console.log('User set in AuthContext from registration response:', response.user);
          return true;
        }
        // If we have a token but no user data, try to get the user from localStorage
        else if (response.token) {
          console.log('No user in registration response, checking localStorage...');
          const storedUser = authService.getUser();

          if (storedUser) {
            setUser(storedUser);
            console.log('User set in AuthContext from localStorage after registration:', storedUser);
            return true;
          }
          // If still no user, try to fetch it from the API
          else {
            console.log('No user in localStorage after registration, fetching from API...');
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                setUser(currentUser);
                console.log('User set in AuthContext from API after registration:', currentUser);
                return true;
              }
            } catch (fetchError) {
              console.error('Error fetching user after registration:', fetchError);
            }
          }
        }

        console.error('Registration response missing valid user data');
        return false;
      } else {
        console.error('Invalid registration response');
        return false;
      }
    } catch (error) {
      console.error('Registration error in AuthContext:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.forgotPassword({ email });
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (
    token: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return checkPermission(user?.permissions, permission);
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasPermission,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
