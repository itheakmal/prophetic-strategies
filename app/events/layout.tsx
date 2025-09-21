'use client'
import AppSidebar from '@/components/AppSidebar';
import HeaderEvents from '@/components/HeaderEvents';
import { EventsProvider } from '@/contexts/EventsContext';

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <EventsProvider>
      <div className="grid gap-5 md:grid-cols-[1fr_260px]">
        <div>
          <HeaderEvents />
          {children}
        </div>
        <AppSidebar />
      </div>
    </EventsProvider>
  );
}
