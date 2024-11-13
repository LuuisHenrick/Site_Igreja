import React from 'react';
import { useStore } from '../../lib/store';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export const UpcomingEventsWidget: React.FC = () => {
  const store = useStore();
  
  const upcomingEvents = [...store.events, ...store.educationEvents]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
        <Calendar className="h-5 w-5 text-indigo-600" />
      </div>

      {upcomingEvents.length > 0 ? (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(event.date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                {'attendees' in event && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendees}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No upcoming events
        </p>
      )}
    </div>
  );
};