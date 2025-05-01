import { useAuth } from '@/contexts/AuthContext';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  ShoppingCart,
  Users
} from 'lucide-react';

import { useEffect } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Log user information for debugging
  console.log('Dashboard - User:', user);
  console.log('Dashboard - isAuthenticated:', isAuthenticated);

  // Fetch latest user data when component mounts
  useEffect(() => {
    console.log('Dashboard component mounted');
    // You can add additional logic here if needed
  }, []);
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading user information...</span>
          </div>
        </div>
      ) : user ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 mb-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-md">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {user.role === 'admin' ? 'Administrator' : 'User'} • Last login: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 rounded-lg shadow-sm p-6 mb-6 border border-yellow-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Welcome to the Dashboard</h2>
              <p className="text-gray-600">You are not logged in. Please log in to see your information.</p>
            </div>
          </div>
        </div>
      )}

      {/* Small Boxes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">150</div>
                <div className="text-white/90">New Orders</div>
              </div>
              <ShoppingCart className="w-12 h-12 opacity-40" />
            </div>
          </div>
          <div className="bg-blue-600/50 backdrop-blur-sm px-4 py-2">
            <div className="text-sm">
              <ArrowUpRight className="w-4 h-4 inline mr-1" />
              <span>12% Increase</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">53%</div>
                <div className="text-white/90">Bounce Rate</div>
              </div>
              <Percent className="w-12 h-12 opacity-40" />
            </div>
          </div>
          <div className="bg-emerald-600/50 backdrop-blur-sm px-4 py-2">
            <div className="text-sm">
              <ArrowDownRight className="w-4 h-4 inline mr-1" />
              <span>5% Decrease</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-md shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">44</div>
                <div className="text-white/90">User Registrations</div>
              </div>
              <Users className="w-12 h-12 opacity-40" />
            </div>
          </div>
          <div className="bg-violet-600/50 backdrop-blur-sm px-4 py-2">
            <div className="text-sm">
              <ArrowUpRight className="w-4 h-4 inline mr-1" />
              <span>8% Increase</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">65</div>
                <div className="text-white/90">Unique Visitors</div>
              </div>
              <Activity className="w-12 h-12 opacity-40" />
            </div>
          </div>
          <div className="bg-amber-600/50 backdrop-blur-sm px-4 py-2">
            <div className="text-sm">
              <ArrowUpRight className="w-4 h-4 inline mr-1" />
              <span>2% Increase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b">Latest Orders</h3>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Order #{1000 + i}</div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">$250.00</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b">Recent Activity</h3>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-700">New user registered</div>
                  <div className="text-sm text-gray-500">3 mins ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b">Sales Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Sales</span>
              <span className="text-xl font-semibold text-gray-800">$24,500</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Online Store</span>
                <span className="font-medium text-gray-800">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Retail Sales</span>
                <span className="font-medium text-gray-800">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}