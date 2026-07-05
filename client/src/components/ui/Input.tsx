import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1 text-left">
      <label className="block text-sm font-medium text-knight">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2 bg-void/50 border rounded-lg text-mist placeholder:text-knight/50 focus:outline-none focus:ring-1 transition-all duration-200 ${
          error 
            ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500' 
            : 'border-knight/30 focus:border-knight focus:ring-knight'
        } ${className}`}
      />
      {error && (
        <p className="text-xs font-medium text-red-400 mt-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};