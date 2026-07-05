import { Button } from '@/components/ui/Button';
import { Ticket } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-void">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          {/* Using custom mist color for a sleek, clean pulse glow effect */}
          <Ticket className="w-12 h-12 text-mist opacity-80 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-mist">
          Velocity Ticket Engine
        </h1>
        <p className="text-knight">
          Client-side dashboard architecture initialized inside the frontend branch.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          {/* Button custom layout configuration adapts variants smoothly to custom theme settings */}
          <Button variant="primary" className="bg-maroon hover:bg-maroon-hover text-mist border border-maroon-hover">
            Explore Events
          </Button>
          <Button variant="secondary" className="bg-transparent border border-knight text-knight hover:text-mist hover:border-mist">
            Admin Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}