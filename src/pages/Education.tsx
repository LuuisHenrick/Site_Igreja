import React, { useState } from 'react';
import { Book, Users, Clock, Calendar, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { CourseList } from '../components/education/CourseList';
import { EventDashboard } from '../components/education/EventDashboard';
import { EventList } from '../components/education/EventList';
import { Modal } from '../components/ui/Modal';
import { EventForm } from '../components/education/EventForm';
import { useStore } from '../lib/store';
import { toast } from 'sonner';

export const Education: React.FC = () => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const store = useStore();
  const events = store.educationEvents || [];

  const handleCreateEvent = (data: Omit<EducationEvent, 'id' | 'registrations'>) => {
    const newEvent = {
      id: Math.random().toString(36).substring(2),
      registrations: [],
      ...data,
    };
    store.addEducationEvent(newEvent);
    setIsAddEventModalOpen(false);
    toast.success('Event created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <Button
          onClick={() => setIsAddEventModalOpen(true)}
          icon={Plus}
        >
          Create Event
        </Button>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EventDashboard events={events} />
        </TabsContent>

        <TabsContent value="events">
          <EventList events={events} />
        </TabsContent>

        <TabsContent value="courses">
          <CourseList />
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Create New Event"
      >
        <EventForm onSubmit={handleCreateEvent} />
      </Modal>
    </div>
  );
};