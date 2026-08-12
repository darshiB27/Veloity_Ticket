"use client";

{/* Event Card Component */}

import React from 'react';
import { Calendar, Tag, Users } from 'lucide-react';
import { Button } from './ui/Button';

interface EventData {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
}

interface EventCardProps {
  event: EventData;
  onSelect: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const isSoldOut = event.availableTickets === 0;
  const isLowStock = event.availableTickets > 0 && event.availableTickets <= 10;
  
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-void border border-knight/10 rounded-xl overflow-hidden shadow-lg hover:border-knight/30 transition-all duration-300 flex flex-col justify-between relative group">
      <div className={`h-1 w-full ${
        isSoldOut ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-maroon'
      }`} />

      <div className="p-6 space-y-4 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xl font-bold text-mist tracking-tight group-hover:text-white transition-colors">
            {event.title}
          </h3>
          {isSoldOut ? (
            <span className="text-xs font-semibold px-2 py-1 bg-red-950/40 border border-red-500/30 text-red-400 rounded-md whitespace-nowrap">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-semibold px-2 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-400 rounded-md whitespace-nowrap animate-pulse">
              Filling Fast
            </span>
          ) : null}
        </div>

        <p className="text-sm text-knight line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 pt-2 text-sm text-knight">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-knight/70" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-knight/70" />
            <span>
              Capacity: <strong className="text-mist">{event.totalTickets}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-knight/70" />
            <span>
              Available slots: <strong className={isSoldOut ? 'text-red-400' : 'text-mist'}>{event.availableTickets}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Button 
          onClick={() => onSelect(event._id)}
          disabled={isSoldOut}
          className={`w-full text-sm font-semibold tracking-wide ${
            isSoldOut 
              ? 'bg-slate-900 border border-knight/10 text-knight cursor-not-allowed' 
              : 'bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover'
          }`}
        >
          {isSoldOut ? 'Registration Closed' : 'Secure a seat'}
        </Button>
      </div>
    </div>
  );
};
