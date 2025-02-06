// src/components/navigation-menu.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Factory } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  label: string;
  href: string;
}

interface MenuCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const NavigationMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 h-screen w-72 bg-white shadow-lg overflow-y-auto">
      <div className="flex items-center p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Bourbon Vanilla Forms</h1>
      </div>
      
      <div className="p-2">
        <MenuCategory 
          title="Production Forms"
          icon={<Factory />}
          items={[
            { label: 'Production Release', href: '/production-release' },
            { label: 'Production Sheet', href: '/production-sheet' },
            { label: 'Volume Control', href: '/volume-control' },
          ]}
        />
      </div>
    </nav>
  );
};

// Category Component
const MenuCategory = ({ title, icon, items }: MenuCategoryProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          {React.cloneElement(icon as any, { className: 'w-5 h-5 text-gray-500' })}
          <span className="font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {items.map((item, index) => (
            <NavButton
              key={index}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Navigation Button Component
interface NavButtonProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const NavButton = ({ label, href, isActive = false }: NavButtonProps) => {
  return (
    <Link href={href}>
      <button
        className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors
          ${isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50'
          }`}
      >
        <span className="text-sm">{label}</span>
      </button>
    </Link>
  );
};

export default NavigationMenu;