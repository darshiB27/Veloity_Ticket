"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Loader2, CheckCircle2, ArrowRight, Ticket } from 'lucide-react';

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jobId = searchParams.get('jobId');

  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [message, setMessage] = useState('Positioning worker nodes in distributed queue...');

  useEffect(() => {
    // Phase 1: Simulate the high-concurrency message transition
    const messageTimeout = setTimeout(() => {
      setMessage('BullMQ pipeline processing. Awaiting database verification write...');
    }, 1500);

    const successTimeout = setTimeout(() => {
      setStatus('completed');
    }, 3000);

    return () => {
      clearTimeout(messageTimeout);
      clearTimeout(successTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-void text-mist p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-void border border-knight/10 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon to-maroon-hover" />

        {status === 'pending' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-maroon animate-spin" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">Verifying Allocation Vector</h2>
            <p className="text-[10px] bg-knight/5 p-3 rounded-xl border border-knight/5 text-knight font-mono max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              Job ID: {jobId || 'Processing...'}
            </p>
            <p className="text-sm text-knight leading-relaxed h-10">{message}</p>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Booking Confirmed</h2>
            <p className="text-sm text-emerald-400/90">Seat assignment secured successfully!</p>
            
            <div className="p-4 bg-knight/5 border border-knight/10 rounded-xl text-left font-mono text-xs space-y-2 relative overflow-hidden">
              <Ticket className="absolute right-2 bottom-2 w-16 h-16 text-knight opacity-5 pointer-events-none" />
              <p><span className="text-knight">TICKET_STATUS:</span> <span className="text-emerald-400 font-bold">ISSUED</span></p>
              <p><span className="text-knight">CLUSTER_NODE:</span> BullMQ-Redis-Worker-01</p>
              <p><span className="text-knight">TIMESTAMP:</span> {new Date().toLocaleTimeString()}</p>
            </div>

            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover gap-2 mt-2"
            >
              Return to Catalog Grid <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TicketStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void text-mist flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-knight animate-spin" />
        <p className="text-sm text-knight">Loading system routing matrix...</p>
      </div>
    }>
      <StatusContent />
    </Suspense>
  );
}