import React from 'react';
import { useStore } from '../../lib/store';
import { Gift } from 'lucide-react';
import { format } from 'date-fns';

export const BirthdayWidget: React.FC = () => {
  const store = useStore();
  const currentMonth = new Date().getMonth();

  const birthdayMembers = store.members
    .filter(member => {
      const birthDate = new Date(member.birthDate);
      return birthDate.getMonth() === currentMonth;
    })
    .sort((a, b) => {
      const dateA = new Date(a.birthDate);
      const dateB = new Date(b.birthDate);
      return dateA.getDate() - dateB.getDate();
    })
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Birthdays This Month</h2>
        <Gift className="h-5 w-5 text-indigo-600" />
      </div>

      {birthdayMembers.length > 0 ? (
        <div className="space-y-4">
          {birthdayMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-3">
              <img
                src={member.photo || 'https://via.placeholder.com/40'}
                alt={member.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(member.birthDate), 'MMMM d')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          No birthdays this month
        </p>
      )}
    </div>
  );
};