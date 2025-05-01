import {
    BarChart3,
    Boxes,
    Calendar,
    ChevronDown,
    FileText,
    LayoutDashboard,
    Mail,
    PieChart,
    Settings,
    ShoppingCart,
    Table,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  name: string;
  icon: any;
  href?: string;
  badge?: { text: string; color: string };
  children?: Omit<NavItem, 'children'>[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { name: 'Analytics', icon: PieChart, href: '/', badge: { text: '150+', color: 'bg-purple-500' } },
      { name: 'E-commerce', icon: ShoppingCart, href: '/ecommerce', badge: { text: 'New', color: 'bg-emerald-500' } }
    ]
  },
  {
    name: 'Components',
    icon: Boxes,
    children: [
      { name: 'Tables', icon: Table, href: '/tables', badge: { text: '10+', color: 'bg-pink-500' } },
      { name: 'Calendar', icon: Calendar, href: '/calendar', badge: { text: '5', color: 'bg-yellow-500' } }
    ]
  },
  {
    name: 'Users',
    icon: Users,
    children: [
      { name: 'All Users', icon: Users, href: '/users' },
      { name: 'Add User', icon: Users, href: '/users/create', badge: { text: 'New', color: 'bg-blue-500' } }
    ]
  },
  {
    name: 'Products',
    icon: ShoppingCart,
    href: '/products',
    badge: { text: '150', color: 'bg-indigo-500' }
  },
  {
    name: 'Reports',
    icon: BarChart3,
    href: '/reports',
    badge: { text: '3', color: 'bg-orange-500' }
  },
  {
    name: 'Documents',
    icon: FileText,
    href: '/documents'
  },
  {
    name: 'Mail',
    icon: Mail,
    href: '/mail',
    badge: { text: '12', color: 'bg-green-500' }
  },
  {
    name: 'Settings',
    icon: Settings,
    href: '/settings'
  },
]

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const renderNavItem = (item: NavItem) => {
    const isOpen = openMenus.includes(item.name)
    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg`}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {(item.children ?? []).map(child => (
                <NavLink
                  key={child.name}
                  to={child.href || '#'}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 text-sm rounded-lg
                    ${isActive
                      ? 'bg-[#17a2b8]/10 text-[#17a2b8]'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <child.icon className="w-4 h-4 mr-3" />
                  <span>{child.name}</span>
                  {child.badge && (
                    <span className={`${child.badge.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {child.badge.text}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        key={item.name}
        to={item.href || '#'}
        className={({ isActive }) => `
          flex items-center justify-between px-3 py-2 rounded-lg
          ${isActive
            ? 'bg-[#17a2b8]/10 text-[#17a2b8]'
            : 'text-gray-700 hover:bg-gray-100'
          }
        `}
      >
        <div className="flex items-center">
          <item.icon className="w-5 h-5 mr-3" />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className={`${item.badge.color} text-white text-xs px-2 py-0.5 rounded-full`}>
            {item.badge.text}
          </span>
        )}
      </NavLink>
    )
  }

  return (
    <aside className="h-full bg-white overflow-y-auto">
      <div className="p-3">
        <div className="mb-4 flex items-center px-3 py-2">
          <img
            src="/vite.svg"
            alt="User"
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Admin Panel</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
        </div>
        <div className="space-y-1">
          {navigation.map(renderNavItem)}
        </div>
      </div>
    </aside>
  )
}