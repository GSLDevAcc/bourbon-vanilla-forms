// src/app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Production System - Home',
  description: 'Production management and control system',
};

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Production System
          </h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Please select a form from the navigation menu to:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Manage production releases</li>
              <li>Create and edit production sheets</li>
              <li>Control production volumes</li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                Quick Navigation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickNavCard 
                  title="Production Release"
                  description="Manage and track production releases"
                  href="/production-release"
                />
                <QuickNavCard 
                  title="Production Sheet"
                  description="Create and edit production sheets"
                  href="/production-sheet"
                />
                <QuickNavCard 
                  title="Volume Control"
                  description="Monitor and adjust production volumes"
                  href="/volume-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickNavCardProps {
  title: string;
  description: string;
  href: string;
}

function QuickNavCard({ title, description, href }: QuickNavCardProps) {
  return (
    <a 
      href={href} 
      className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
    >
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}