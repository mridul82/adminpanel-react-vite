import userService from '@/services/userService';
import { UserCreateData, UserUpdateData } from '@/types/user';
import { AlertCircle, ArrowLeft, Lock, Mail, Save, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserCreateData | UserUpdateData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    roles: ['user'] // Added for Laravel API compatibility
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getUser(id!);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        // Set roles array based on the role string
        roles: [user.role || 'user'],
        // Don't set password fields when editing
        password: '',
        password_confirmation: ''
      });

      console.log('Fetched user data:', user);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };

      // If role is changed, also update the roles array
      if (name === 'role') {
        updatedData.roles = [value];
        console.log('Updated roles array:', updatedData.roles);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);

      // Validate form
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        setLoading(false);
        return;
      }

      if (!isEditMode && (!formData.password || !formData.password_confirmation)) {
        setError('Password and confirmation are required for new users');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.password_confirmation) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Prepare data for submission
      let dataToSubmit: UserCreateData | UserUpdateData = { ...formData };

      // If editing and password is empty, remove password fields
      if (isEditMode) {
        if (!formData.password || formData.password.trim() === '') {
          // Remove password fields completely if they're empty
          const { password, password_confirmation, ...rest } = dataToSubmit;
          dataToSubmit = rest;
          console.log('Removed empty password fields for update');
        } else {
          // Make sure password_confirmation is included if password is set
          dataToSubmit.password_confirmation = formData.password_confirmation;
          console.log('Including password fields for update');
        }
      }

      if (isEditMode) {
        await userService.updateUser(id!, dataToSubmit);
        setSuccess('User updated successfully');
      } else {
        await userService.createUser(dataToSubmit as UserCreateData);
        setSuccess('User created successfully');
        // Reset form after successful creation
        if (!isEditMode) {
          setFormData({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'user',
            roles: ['user']
          });
        }
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 1500);

    } catch (err: any) {
      console.error('Error saving user:', err);
      console.log('Error response:', err.response?.data);

      if (err.response?.data?.errors) {
        // Format Laravel validation errors
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .map((msg: string) => msg.trim());

        setError(errorMessages.join(', '));

        // Log detailed validation errors for debugging
        console.log('Validation errors:', err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 422) {
        // Special handling for validation errors that might not follow the standard format
        setError('Validation failed. Please check your input and try again.');
      } else {
        setError(err.message || 'Failed to save user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit User' : 'Create User'}
        </h1>
        <button
          type="button"
          onClick={() => navigate('/users')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Form */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password {isEditMode && <span className="text-gray-500">(Leave blank to keep current password)</span>}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                required={!isEditMode}
              />
            </div>
          </div>

          {/* Password Confirmation Field */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                required={!isEditMode}
              />
            </div>
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update User' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
