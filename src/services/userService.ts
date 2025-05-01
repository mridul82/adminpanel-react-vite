import { User, UserCreateData, UserListResponse, UserUpdateData } from '@/types/user';
import api from './api';

const userService = {
  // Get all users with pagination
  async getUsers(page = 1, perPage = 10): Promise<UserListResponse> {
    try {
      const response = await api.get(`/users?page=${page}&per_page=${perPage}`);
      console.log('Raw API response:', response);

      // Format the response to match our expected structure
      let formattedResponse: UserListResponse = {
        data: []
      };

      if (response.data) {
        console.log('Processing API response data:', response.data);

        if (Array.isArray(response.data)) {
          // If the API returns an array directly
          formattedResponse.data = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If the API returns { data: [...] }
          formattedResponse.data = response.data.data;

          // Copy pagination metadata if available
          if (response.data.meta) {
            formattedResponse.meta = response.data.meta;
          } else if (response.data.current_page) {
            // If pagination info is at the root level
            formattedResponse.meta = {
              current_page: response.data.current_page,
              from: response.data.from,
              last_page: response.data.last_page,
              path: response.data.path,
              per_page: response.data.per_page,
              to: response.data.to,
              total: response.data.total
            };
          }
        } else if (response.data.data && response.data.data.users && Array.isArray(response.data.data.users)) {
          // If the API returns { data: { users: [...], pagination: {...} } }
          console.log('Found users array in data.data.users');
          formattedResponse.data = response.data.data.users;

          // Copy pagination metadata if available
          if (response.data.data.pagination) {
            formattedResponse.meta = {
              current_page: response.data.data.pagination.current_page,
              from: response.data.data.pagination.from,
              last_page: response.data.data.pagination.last_page,
              path: response.data.data.pagination.path || '',
              per_page: response.data.data.pagination.per_page,
              to: response.data.data.pagination.to,
              total: response.data.data.pagination.total
            };
          }
        } else {
          // Try to find users array in any nested structure
          const findUsersArray = (obj: any): User[] | null => {
            if (!obj || typeof obj !== 'object') return null;

            // Check if this object has a users property that is an array
            if (obj.users && Array.isArray(obj.users)) {
              console.log('Found users array:', obj.users);
              return obj.users;
            }

            // Check all properties of this object
            for (const key in obj) {
              if (typeof obj[key] === 'object') {
                const result = findUsersArray(obj[key]);
                if (result) return result;
              }
            }

            return null;
          };

          const usersArray = findUsersArray(response.data);
          if (usersArray) {
            formattedResponse.data = usersArray;

            // Try to find pagination info
            const findPagination = (obj: any): any | null => {
              if (!obj || typeof obj !== 'object') return null;

              // Check if this object has pagination properties
              if (obj.current_page && obj.total) {
                return obj;
              }

              // Check if this object has a pagination property
              if (obj.pagination && typeof obj.pagination === 'object') {
                return obj.pagination;
              }

              // Check all properties of this object
              for (const key in obj) {
                if (typeof obj[key] === 'object') {
                  const result = findPagination(obj[key]);
                  if (result) return result;
                }
              }

              return null;
            };

            const pagination = findPagination(response.data);
            if (pagination) {
              formattedResponse.meta = {
                current_page: pagination.current_page,
                from: pagination.from,
                last_page: pagination.last_page,
                path: pagination.path || '',
                per_page: pagination.per_page,
                to: pagination.to,
                total: pagination.total
              };
            }
          } else {
            console.warn('Unexpected API response format:', response.data);
            formattedResponse.data = [];
          }
        }
      }

      return formattedResponse;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return empty data on error
      return { data: [] };
    }
  },

  // Get a single user by ID
  async getUser(id: number | string): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      console.log(`User ${id} API response:`, response);

      // Format the response to match our expected structure
      let userData: User;

      if (response.data) {
        if (response.data.data && response.data.data.id) {
          // If the API returns { data: { id: ..., name: ..., ... } }
          userData = response.data.data;
        } else if (response.data.id) {
          // If the API returns { id: ..., name: ..., ... }
          userData = response.data;
        } else {
          console.warn('Unexpected user API response format:', response.data);
          throw new Error('Invalid user data format received from API');
        }

        return userData;
      } else {
        throw new Error('No data received from API');
      }
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create a new user
  async createUser(userData: UserCreateData): Promise<User> {
    try {
      // Make sure roles is included in the request
      const dataToSend = { ...userData };

      // Ensure roles is set if not already
      if (!dataToSend.roles && dataToSend.role) {
        dataToSend.roles = [dataToSend.role];
      }

      console.log('Creating user with data:', dataToSend);

      const response = await api.post('/users', dataToSend);
      console.log('Create user API response:', response);

      // Format the response to match our expected structure
      let createdUser: User;

      if (response.data) {
        if (response.data.data && response.data.data.id) {
          // If the API returns { data: { id: ..., name: ..., ... } }
          createdUser = response.data.data;
        } else if (response.data.id) {
          // If the API returns { id: ..., name: ..., ... }
          createdUser = response.data;
        } else if (response.data.user) {
          // If the API returns { user: { id: ..., name: ..., ... } }
          createdUser = response.data.user;
        } else {
          console.warn('Unexpected create user API response format:', response.data);
          throw new Error('Invalid user data format received from API');
        }

        return createdUser;
      } else {
        throw new Error('No data received from API');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);

      // Format validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  // Update an existing user
  async updateUser(id: number | string, userData: UserUpdateData): Promise<User> {
    try {
      // Make sure roles is included in the request
      const dataToSend = {
        ...userData,
        _method: 'PUT'
      };

      // Ensure roles is set if not already
      if (!dataToSend.roles && dataToSend.role) {
        dataToSend.roles = [dataToSend.role];
      }

      console.log(`Updating user ${id} with data:`, dataToSend);

      // Use post with _method=PUT for better compatibility with Laravel
      const response = await api.post(`/users/${id}`, dataToSend);
      console.log(`Update user ${id} API response:`, response);

      // Format the response to match our expected structure
      let updatedUser: User;

      if (response.data) {
        if (response.data.data && response.data.data.id) {
          // If the API returns { data: { id: ..., name: ..., ... } }
          updatedUser = response.data.data;
        } else if (response.data.id) {
          // If the API returns { id: ..., name: ..., ... }
          updatedUser = response.data;
        } else if (response.data.user) {
          // If the API returns { user: { id: ..., name: ..., ... } }
          updatedUser = response.data.user;
        } else {
          console.warn('Unexpected update user API response format:', response.data);
          throw new Error('Invalid user data format received from API');
        }

        return updatedUser;
      } else {
        throw new Error('No data received from API');
      }
    } catch (error: any) {
      console.error(`Error updating user ${id}:`, error);

      // Format validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  },

  // Delete a user
  async deleteUser(id: number | string): Promise<void> {
    try {
      const response = await api.delete(`/users/${id}`);
      console.log(`Delete user ${id} API response:`, response);
    } catch (error: any) {
      console.error(`Error deleting user ${id}:`, error);

      // Format error messages
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages.join(', '));
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this user');
      } else if (error.response?.status === 404) {
        throw new Error('User not found');
      }

      throw error;
    }
  }
};

export default userService;
