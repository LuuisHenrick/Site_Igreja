import React from 'react';
import { Users } from 'lucide-react';

interface Event {
  title: string;
  date: string;
  attendees: number;
}

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{event.attendees}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};