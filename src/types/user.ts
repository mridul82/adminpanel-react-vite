export interface User {
  id?: number | string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
  email_verified_at?: string | null;
}

export interface UserListResponse {
  data: User[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  roles?: string[]; // Added for Laravel API compatibility
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  roles?: string[]; // Added for Laravel API compatibility
}
