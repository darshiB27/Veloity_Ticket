"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid authorization credentials provided.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-4">
      <div className="w-full max-w-md bg-void border border-knight/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon to-maroon-hover" />
        
        <div className="flex items-center gap-3 mb-6">
          <LogIn className="w-6 h-6 text-mist" />
          <h2 className="text-2xl font-bold text-mist tracking-tight">Account Sign In</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-sm rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="you@example.com" 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••" 
          />
          
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full mt-2 bg-maroon hover:bg-maroon-hover border border-maroon-hover text-mist"
          >
            Authenticate
          </Button>
        </form>

        <p className="text-sm text-center text-knight mt-6">
          New to the pipeline?{' '}
          <Link href="/register" className="text-mist hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
