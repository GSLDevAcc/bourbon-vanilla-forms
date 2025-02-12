// src/components/ui/success-animation.tsx
"use client"

import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SuccessAnimation = ({ isOpen, message, onClose }: SuccessAnimationProps) => {
  if (!isOpen) return null;

  // Auto close after animation
  setTimeout(onClose, 2000);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 animate-scaleIn">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-checkmark">
          <Check className="text-white w-10 h-10" />
        </div>
        <p className="text-xl font-semibold text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default SuccessAnimation;