import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Share2, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { EventForm } from './EventForm';
import { EventRegistrationForm } from './EventRegistrationForm';
import { useStore } from '../../lib/store';
import { toast } from 'sonner';
import type { EducationEvent } from '../../lib/store';

interface EventListProps {
  events: EducationEvent[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  
  const store = useStore();

  const handleEdit = (event: EducationEvent) => {
    store.updateEducationEvent(event.id, event);
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    toast.success('Event updated successfully');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      store.deleteEducationEvent(id);
      toast.success('Event deleted successfully');
    }
  };

  const handleShare = async (event: EducationEvent) => {
    try {
      const shareUrl = `${window.location.origin}/education/events/${event.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Event link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy event link');
    }
  };

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="md:flex">
            {event.imageUrl && (
              <div className="md:flex-shrink-0">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="h-48 w-full object-cover md:h-full md:w-48"
                />
              </div>
            )}
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  {event.logoUrl && (
                    <img
                      src={event.logoUrl}
                      alt="Event logo"
                      className="h-8 w-8 object-contain mb-2"
                    />
                  )}
                  <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                  {event.subtitle && (
                    <p className="text-sm text-gray-500">{event.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    icon={Share2}
                    onClick={() => handleShare(event)}
                  >
                    Share
                  </Button>
                  <Button
                    variant="secondary"
                    icon={Edit2}
                    onClick={() => {
                      setSelectedEvent(event.id);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(`${event.date}T${event.time}`), 'PPp')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {event.registrations.length} registered
                  {event.maxParticipants && ` / ${event.maxParticipants} max`}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {event.isFree ? 'Free' : `$${event.price?.toFixed(2)}`}
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">{event.description}</p>

              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSelectedEvent(event.id);
                    setIsRegistrationModalOpen(true);
                  }}
                  disabled={event.maxParticipants !== undefined && 
                    event.registrations.length >= event.maxParticipants}
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>

          {event.registrations.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900">Recent Registrations</h3>
              <div className="mt-2 divide-y divide-gray-200">
                {event.registrations.slice(0, 5).map((registration) => (
                  <div key={registration.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {registration.name}
                      </p>
                      <p className="text-sm text-gray-500">{registration.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      registration.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : registration.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registration.paymentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Edit Event"
      >
        {selectedEvent && (
          <EventForm
            event={events.find(e => e.id === selectedEvent)}
            onSubmit={(data) => handleEdit({ ...data, id: selectedEvent, registrations: [] })}
          />
        )}
      </Modal>

      <Modal
        isOpen={isRegistrationModalOpen}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Register for Event"
      >
        {selectedEvent && (
          <EventRegistrationForm
            event={events.find(e => e.id === selectedEvent)!}
            onSubmit={(data) => {
              const registration = {
                id: Math.random().toString(36).substring(2),
                eventId: selectedEvent,
                ...data,
                paymentStatus: 'pending',
                paymentAmount: events.find(e => e.id === selectedEvent)?.price || 0,
                registeredAt: new Date().toISOString(),
              };
              store.addEventRegistration(selectedEvent, registration);
              setIsRegistrationModalOpen(false);
              setSelectedEvent(null);
              toast.success('Registration submitted successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};