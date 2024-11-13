import React from 'react';
import { Clock, MapPin, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
    >
      <div className="flex items-center space-x-4">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-gray-200" />
        )}
        <div>
          <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {format(new Date(`${event.date}T${event.time}`), 'PPp')}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {event.location}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          {event.cost.isFree ? 'Free' : `$${event.cost.amount?.toFixed(2)}`}
        </div>
        {event.attendees > 0 && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {event.attendees}
          </div>
        )}
      </div>
    </div>
  );
};