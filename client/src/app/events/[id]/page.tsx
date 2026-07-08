"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Calendar, Users, ShieldCheck, RefreshCw, Loader2 } from 'lucide-react';

interface EventDetail {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  const fetchEventDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get('/tickets/events');
      const targetEvent = res.data.find((e: EventDetail) => e._id === id);
      if (!targetEvent) {
        setError('Target event vector not found in active registries.');
        return;
      }
      setEvent(targetEvent);
    } catch (err: any) {
      setError('Aborted tracking. Unable to stream isolated inventory metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const handleBookingExecution = async () => {
    if (!user || !user.id) {
      setBookingMessage('Session invalid. Please re-authenticate.');
      return;
    }

    setIsBooking(true);
    setBookingMessage('');
    
    try {
      const response = await apiClient.post('/tickets/book', { 
        eventId: id,
        userId: user.id 
      });
      
      setBookingMessage('Request dispatched to cluster pipeline. Awaiting persistence checks...');
      
      const finalJobId = response.data?.jobId || response.data?.data?.jobId || response.data?.id || response.data?.data?.id;

      setTimeout(() => {
        router.push(`/tickets/status?jobId=${finalJobId || 'queued'}&eventId=${id}`);
      }, 1500);

    } catch (err: any) {
      setIsBooking(false);
      setBookingMessage(err.response?.data?.message || 'Booking submission rejected.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void text-mist flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-knight animate-spin" />
        <p className="text-sm text-knight">Synchronizing real-time inventory nodes...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-void text-mist flex flex-col items-center justify-center p-4">
        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl text-center max-w-md">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <Link href="/" className="text-sm text-mist hover:underline flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Return to Cluster Grid
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.availableTickets === 0;

  return (
    <main className="min-h-screen bg-void text-mist p-6 md:p-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-void border border-knight/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon to-maroon-hover" />
        
        <button 
          onClick={() => router.push('/')}
          className="text-sm text-knight hover:text-mist flex items-center gap-1 mb-8 transition-colors group"
          disabled={isBooking}
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Explorer Matrix
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {event.title}
            </h1>
            <p className="text-sm text-knight flex items-center gap-2 pt-1">
              <Calendar className="w-4 h-4" /> 
              {new Date(event.eventDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          </div>

          <p className="text-knight leading-relaxed bg-void/50 p-4 border border-knight/5 rounded-xl">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="p-4 bg-void/30 border border-knight/10 rounded-xl">
              <span className="block text-xs font-medium text-knight mb-1">ALLOCATED VOLUME</span>
              <span className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-knight" /> {event.totalTickets}
              </span>
            </div>
            
            <div className={`p-4 border rounded-xl ${
              isSoldOut ? 'bg-red-950/10 border-red-500/20' : 'bg-maroon/10 border-maroon/30'
            }`}>
              <span className="block text-xs font-medium text-knight mb-1">REMAINING INVENTORY</span>
              <span className={`text-2xl font-bold flex items-center gap-2 ${
                isSoldOut ? 'text-red-400' : 'text-mist'
              }`}>
                <ShieldCheck className="w-5 h-5" /> {event.availableTickets}
              </span>
            </div>
          </div>

          {bookingMessage && (
            <div className={`p-3 text-sm text-center border rounded-lg ${
              bookingMessage.includes('rejected') || bookingMessage.includes('invalid')
                ? 'bg-red-950/30 border border-red-500/20 text-red-400' 
                : 'bg-maroon/30 border border-maroon/40 text-mist animate-pulse'
            }`}>
              {bookingMessage}
            </div>
          )}

          <div className="pt-4 border-t border-knight/10 flex flex-col gap-3">
            <Button 
              onClick={handleBookingExecution}
              disabled={isSoldOut || isBooking}
              className={`w-full py-3 font-semibold ${
                isSoldOut 
                  ? 'bg-slate-900 border border-knight/10 text-knight cursor-not-allowed' 
                  : 'bg-maroon hover:bg-maroon-hover border border-maroon-hover text-mist'
              }`}
            >
              {isBooking ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing Queue...
                </span>
              ) : isSoldOut ? (
                'Allocation Pools Exhausted'
              ) : (
                'Initialize Booking Request'
              )}
            </Button>
            
            <p className="text-center text-xs text-knight/70">
              Requests are processed asynchronously through a distributed fallback lock queue cluster.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}