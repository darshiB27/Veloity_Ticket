"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/apiClient';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // 🔍 Your exact specified Email Regex rule parsing pattern 
    const emailRegex = /^[^@]+@[^@.]+\.[a-zA-Z0-9]{2,}$/;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid format (e.g., username@domain.com).');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration sequence aborted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="w-full max-w-md bg-void border border-knight/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon-hover to-maroon" />

        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="w-6 h-6 text-mist" />
          <h2 className="text-2xl font-bold text-mist tracking-tight">Register here</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Darshika Bhasker" 
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              if(emailError) setEmailError(''); 
            }} 
            error={emailError}
            required 
            placeholder="Darshika@bhasker.com" 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••••••" 
          />
          
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full mt-2 bg-maroon hover:bg-maroon-hover border border-maroon-hover text-mist"
          >
            Register Base Account
          </Button>
        </form>

        <p className="text-sm text-center text-knight mt-6">
          Already registered?{' '}
          <Link href="/login" className="text-mist hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}