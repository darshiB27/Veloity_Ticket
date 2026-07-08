"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, type, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  // Determine actual runtime input behavior string based on state
  const runtimeType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="w-full space-y-1 text-left">
      <label className="block text-sm font-medium text-knight">
        {label}
      </label>
      <div className="relative w-full flex items-center">
        <input
          {...props}
          type={runtimeType}
          className={`w-full px-4 py-2 pr-12 bg-void/50 border rounded-lg text-mist placeholder:text-knight/50 focus:outline-none focus:ring-1 transition-all duration-200 ${
            error 
              ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500' 
              : 'border-knight/30 focus:border-knight focus:ring-knight'
          } ${className}`}
        />
        
        {/* Render interactive eye icon button exclusively on password formats */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-knight hover:text-mist transition-colors duration-150 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 select-none" />
            ) : (
              <Eye className="w-5 h-5 select-none" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-400 mt-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};