import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#7ab817]">Admin</span>
            <span className="font-bold text-xl text-blue-600">Panel</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle && <p className="mt-1 text-blue-100">{subtitle}</p>}
            </div>
            
            {/* Card Body */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 bg-white border-t text-center text-sm text-gray-600">
        <p><strong>Copyright © 2025.</strong> All rights reserved.</p>
      </footer>
    </div>
  );
}
