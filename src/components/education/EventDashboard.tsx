import React from 'react';
import { Users, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import type { EducationEvent } from '../../lib/store';

interface EventDashboardProps {
  events: EducationEvent[];
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ events }) => {
  const stats = React.useMemo(() => {
    const totalRegistrations = events.reduce(
      (sum, event) => sum + event.registrations.length,
      0
    );

    const totalRevenue = events.reduce(
      (sum, event) => sum + event.registrations.reduce(
        (eventSum, reg) => eventSum + reg.paymentAmount,
        0
      ),
      0
    );

    const upcomingEvents = events.filter(
      event => new Date(event.date) > new Date()
    ).length;

    return [
      {
        label: 'Total Registrations',
        value: totalRegistrations,
        icon: Users,
        color: 'blue',
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(totalRevenue),
        icon: DollarSign,
        color: 'green',
      },
      {
        label: 'Upcoming Events',
        value: upcomingEvents,
        icon: Calendar,
        color: 'purple',
      },
    ];
  }, [events]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Registrations
          </h2>
          <div className="space-y-4">
            {events.flatMap(event =>
              event.registrations
                .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
                .slice(0, 5)
                .map(registration => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{registration.name}</p>
                      <p className="text-sm text-gray-500">
                        {event.title} • {new Date(registration.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : registration.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registration.paymentStatus.charAt(0).toUpperCase() + registration.paymentStatus.slice(1)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};