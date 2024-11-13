import React from 'react';
import { Edit2, Trash2, Share2, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface EventViewProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventView: React.FC<EventViewProps> = ({ event, onEdit, onDelete }) => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(event.shareUrl);
      toast.success('Event link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy event link');
    }
  };

  return (
    <div className="space-y-6">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
          <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
            event.type === 'service' ? 'bg-blue-100 text-blue-800' :
            event.type === 'meeting' ? 'bg-green-100 text-green-800' :
            event.type === 'special' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant="secondary"
            icon={Edit2}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span>{format(new Date(`${event.date}T${event.time}`), 'PPpp')}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <MapPin className="h-5 w-5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <DollarSign className="h-5 w-5" />
            <span>{event.cost.isFree ? 'Free' : `$${event.cost.amount?.toFixed(2)}`}</span>
          </div>
          {event.attendees > 0 && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Users className="h-5 w-5" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-500 whitespace-pre-wrap">{event.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Share Event</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={event.shareUrl}
            readOnly
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Button
            variant="secondary"
            icon={Share2}
            onClick={handleShare}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};