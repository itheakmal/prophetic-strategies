'use client'
import AppSidebar from '@/components/AppSidebar';
import HeaderEvents from '@/components/HeaderEvents';
import { EventsProvider } from '@/contexts/EventsContext';

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <EventsProvider>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <HeaderEvents />
        
        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {children}
          </div>
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <AppSidebar />
          </div>
        </div>
      </div>
    </EventsProvider>
  );
}
