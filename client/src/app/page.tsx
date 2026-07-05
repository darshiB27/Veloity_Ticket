"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Ticket, LogIn, UserPlus, LogOut, ShieldAlert } from 'lucide-react';

export default function Home() {
  const { user, logout, token } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-void">
      <div className="text-center space-y-6 max-w-md w-full border border-knight/10 p-8 rounded-2xl bg-void/50 backdrop-blur-sm shadow-xl">
        <div className="flex justify-center">
          <Ticket className="w-16 h-16 text-mist opacity-80 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-mist">
            Velocity Ticket Engine
          </h1>
          <p className="text-knight text-sm">
            High-Performance Distributed Booking Infrastructure
          </p>
        </div>

        <hr className="border-knight/10 my-4" />

        {/* Dynamic Context View Mapping Based on Session Token State */}
        {token && user ? (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-maroon/20 border border-maroon/40 rounded-lg">
              <p className="text-sm text-knight">
                Authenticated Operator: <span className="text-mist font-semibold">{user.name}</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="primary" className="w-full bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover">
                Explore Event Catalog
              </Button>
              <Button variant="secondary" className="w-full bg-transparent border border-knight/30 text-knight hover:text-mist hover:border-mist">
                System Telemetry
              </Button>
              <button 
                onClick={logout}
                className="mt-2 text-xs text-knight hover:text-red-400 flex items-center justify-center gap-1 transition-colors duration-200"
              >
                <LogOut className="w-3 h-3" /> Terminate Session
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-knight px-4">
              Access restricted. Please authenticate with the cluster gate to stream ticket inventories.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" passHref legacyBehavior>
                <a className="w-full">
                  <Button variant="primary" className="w-full bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                </a>
              </Link>
              
              <Link href="/register" passHref legacyBehavior>
                <a className="w-full">
                  <Button variant="secondary" className="w-full bg-transparent border border-knight/30 text-knight hover:text-mist hover:border-mist gap-2">
                    <UserPlus className="w-4 h-4" /> Register
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}