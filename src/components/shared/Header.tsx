import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Menu, MessageSquare, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white border-b h-[57px] flex items-center">
      <div className="flex items-center px-3 gap-4 w-[250px] border-r h-full">
        <span className="font-bold text-xl text-[#7ab817]">Admin</span>
        <span className="font-bold text-xl text-white">Panel</span>
      </div>
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-700"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Search bar */}
          <div className="hidden sm:flex items-center ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 pr-4 py-1.5 text-sm border rounded-md focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative group">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#17a2b8] text-[10px] flex items-center justify-center text-white rounded-full">3</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative group">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-[10px] flex items-center justify-center text-white rounded-full">15</span>
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <div className="relative">
            <div
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm text-white">{user?.name || 'User'}</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                {user && (
                  <div className="px-4 py-2 border-b">
                    <div className="font-medium text-sm text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}