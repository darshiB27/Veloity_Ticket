import { Button } from '@/components/ui/Button';
import { Ticket } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <Ticket className="w-12 h-12 text-emerald-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Velocity Ticket Engine
        </h1>
        <p className="text-slate-400">
          Client-side dashboard architecture initialized inside the frontend branch.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button variant="primary">Explore Events</Button>
          <Button variant="secondary">Admin Dashboard</Button>
        </div>
      </div>
    </main>
  );
}