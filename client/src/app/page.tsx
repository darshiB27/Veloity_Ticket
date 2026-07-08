"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { EventCard } from '@/components/EventCard';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/apiClient';
import { Ticket, LogIn, UserPlus, LogOut, LayoutGrid, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the active events database catalog
  useEffect(() => {
    if (token) {
      const fetchEvents = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await apiClient.get('/tickets/events');
          setEvents(res.data);
        } catch (err: any) {
          setError('Failed to fetch event catalog metrics.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [token]);

  const handleEventSelection = (id: string) => {
    router.push(`/events/${id}`);
  };

  return (
    <main className="min-h-screen bg-void text-mist flex flex-col">
      {/* Dynamic Upper Control Dock */}
      <header className="border-b border-knight/10 bg-void/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-mist opacity-80" />
          <span className="font-bold tracking-tight text-xl">Velocity Ticket</span>
        </div>

        {token && user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-knight hidden sm:inline">
              Welcome, <strong className="text-mist">{user.name}</strong>
            </span>
            <button 
              onClick={logout}
              className="text-xs bg-maroon hover:bg-maroon-hover border border-maroon-hover text-mist px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        ) : null}
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 text-center flex flex-col justify-center items-center">
        {token ? (
          <div className="w-full space-y-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-5 h-5 text-knight" />
              <h2 className="text-2xl font-bold tracking-tight text-mist">Active Event Explorer</h2>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-knight animate-spin" />
                <p className="text-sm text-knight">Streaming latest inventories...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-sm rounded-xl max-w-md mx-auto text-center">
                {error}
              </div>
            ) : events.length === 0 ? (
              <p className="text-sm text-knight text-center py-20">No active events found in the network grid.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                  <EventCard key={event._id} event={event} onSelect={handleEventSelection} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Locked State Gateway View */
          <div className="max-w-md w-full border border-knight/10 p-8 rounded-2xl bg-void/50 shadow-xl space-y-6">
            <div className="flex justify-center">
              <Ticket className="w-16 h-16 text-mist opacity-80 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-mist">Velocity Ticket</h1>
              <p className="text-knight text-sm">High-Performance Distributed Booking Infrastructure</p>
            </div>
            <hr className="border-knight/10" />
            <p className="text-sm text-knight px-4">
              Access restricted. Please authenticate with the cluster gate to stream ticket inventories.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" className="w-full">
                <Button variant="primary" className="w-full bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="secondary" className="w-full bg-transparent border border-knight/30 text-knight hover:text-mist hover:border-mist gap-2">
                  <UserPlus className="w-4 h-4" /> Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}