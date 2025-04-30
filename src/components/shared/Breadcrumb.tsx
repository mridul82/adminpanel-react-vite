import { useLocation, NavLink } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)
  
  return (
    <nav className="flex items-center text-sm mb-6">
      <NavLink 
        to="/" 
        className={({ isActive }) => `
          flex items-center hover:text-indigo-600 transition-colors
          ${isActive ? 'text-indigo-600' : 'text-gray-500'}
        `}
      >
        <Home className="w-4 h-4" />
      </NavLink>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        
        return (
          <span key={name} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {isLast ? (
              <span className="text-indigo-600 font-medium capitalize">
                {name}
              </span>
            ) : (
              <NavLink 
                to={routeTo} 
                className="hover:text-indigo-600 text-gray-500 capitalize transition-colors"
              >
                {name}
              </NavLink>
            )}
          </span>
        )
      })}
    </nav>
  )
}