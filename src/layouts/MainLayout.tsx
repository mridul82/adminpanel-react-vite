import { ReactNode, useState } from 'react'
import Sidebar from '@/components/shared/Sidebar'
import Header from '@/components/shared/Header'
import Breadcrumb from '@/components/shared/Breadcrumb'
import { X } from 'lucide-react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f4f6f9]">
      <Header onMenuClick={toggleMobileMenu} />
      <div className="flex flex-1 w-full relative">
        {/* Mobile menu overlay */}
        <div 
          className={`fixed inset-0 bg-gray-900/50 lg:hidden transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={toggleMobileMenu}
        />
        
        {/* Sidebar */}
        <div 
          className={`fixed lg:sticky top-[57px] h-[calc(100vh-57px)] w-[250px] transition-transform duration-300 ease-in-out z-30
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <Sidebar />
          <button 
            onClick={toggleMobileMenu}
            className="absolute top-4 -right-12 p-2 rounded-lg bg-white shadow-lg lg:hidden hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="p-4 lg:pl-4">
            <Breadcrumb />
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3 px-4 text-right bg-white border-t text-sm text-gray-600">
        <strong>Copyright © 2025.</strong> All rights reserved.
      </footer>
    </div>
  )
}