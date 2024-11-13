import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Share2,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useStore } from '../lib/store';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EventForm } from '../components/calendar/EventForm';
import { EventView } from '../components/calendar/EventView';
import { EventCard } from '../components/calendar/EventCard';

export const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const store = useStore();
  const events = store.events || [];

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePreviousMonth = () => setSelectedDate(subMonths(selectedDate, 1));
  const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  const handleAddEvent = (data: Omit<Event, 'id' | 'shareUrl'>) => {
    const newEvent = {
      ...data,
      id: Math.random().toString(36).substring(2),
      shareUrl: `${window.location.origin}/events/${Math.random().toString(36).substring(2)}`,
    };
    store.addEvent(newEvent);
    setIsAddModalOpen(false);
    toast.success('Event added successfully');
  };

  const handleEditEvent = (id: string, data: Partial<Event>) => {
    store.updateEvent(id, data);
    setIsEditModalOpen(false);
    setSelectedEvent(null);
    toast.success('Event updated successfully');
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      store.deleteEvent(id);
      setIsViewModalOpen(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully');
    }
  };

  const getDayEvents = (date: Date) =>
    events.filter((event) => isSameDay(new Date(event.date), date));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={Plus}
        >
          Add Event
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px mt-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {days.map((day, dayIdx) => {
              const dayEvents = getDayEvents(day);
              const isCurrentMonth = isSameMonth(day, selectedDate);

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] border-t border-l ${
                    dayIdx % 7 === 6 ? 'border-r' : ''
                  } ${
                    Math.floor(dayIdx / 7) === Math.floor(days.length / 7) - 1
                      ? 'border-b'
                      : ''
                  } ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="px-2 py-1">
                    <button
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        isSameDay(day, new Date())
                          ? 'bg-indigo-600 text-white'
                          : isCurrentMonth
                          ? 'text-gray-900 hover:bg-gray-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                    <div className="space-y-1 mt-1">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event.id);
                            setIsViewModalOpen(true);
                          }}
                          className="w-full text-left"
                        >
                          <div className={`
                            px-1 py-0.5 text-xs rounded-sm truncate
                            ${event.type === 'service' ? 'bg-blue-100 text-blue-800' :
                              event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                              event.type === 'special' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {event.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {events
              .filter((event) => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => {
                    setSelectedEvent(event.id);
                    setIsViewModalOpen(true);
                  }}
                />
              ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Event"
      >
        <EventForm onSubmit={handleAddEvent} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Event Details"
      >
        {selectedEvent && (
          <EventView
            event={events.find((e) => e.id === selectedEvent)!}
            onEdit={() => {
              setIsViewModalOpen(false);
              setIsEditModalOpen(true);
            }}
            onDelete={() => handleDeleteEvent(selectedEvent)}
          />
        )}
      </Modal>

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
            event={events.find((e) => e.id === selectedEvent)}
            onSubmit={(data) => handleEditEvent(selectedEvent, data)}
          />
        )}
      </Modal>
    </div>
  );
};