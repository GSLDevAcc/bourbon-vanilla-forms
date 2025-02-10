// src/components/navigation-menu.tsx
// src/components/navigation-menu.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Factory, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

interface NavButtonProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const NavigationMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMinimized(true);
  };

  return (
    <>
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50",
        isMinimized ? "w-12" : "w-72"
      )}>
        {/* Minimize/Maximize Button */}
        <div className={cn(
          "fixed top-2 left-0 transition-all duration-300 ease-in-out", // Reduced from top-4 to top-2
          isMinimized ? "pl-2" : "pl-64"
        )}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-md"
            title={isMinimized ? "Expand menu" : "Minimize menu"}
          >
            {isMinimized ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-500" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Menu Content - Only visible when not minimized */}
        {!isMinimized && (
          <div className="h-full bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center p-2 border-b"> {/* Reduced padding from p-4 to p-2 */}
              <h1 className="text-xl font-bold text-gray-800">Bourbon Vanilla</h1>
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
                onNavigate={handleNavigation}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Wrapper */}
      <main className={cn(
        "min-h-screen transition-all duration-300 ease-in-out pt-4", // Reduced from py-8 to pt-4
        isMinimized ? "ml-12" : "ml-72"
      )}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Your main content will be rendered here */}
        </div>
      </main>
    </>
  );
};

interface MenuCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  onNavigate: (href: string) => void;
}
// Category Component
const MenuCategory = ({ title, icon, items, onNavigate }: MenuCategoryProps) => {
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
              onClick={() => onNavigate(item.href)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface NavButtonProps {
  label: string;
  href: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavButton = ({ label, href, isActive = false, onClick }: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      )}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default NavigationMenu;