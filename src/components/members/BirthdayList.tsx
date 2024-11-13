import React from 'react';
import { format } from 'date-fns';
import { Cake } from 'lucide-react';
import type { Member } from '../../lib/store';

interface BirthdayListProps {
  members: Member[];
  currentMonth?: number;
}

export const BirthdayList: React.FC<BirthdayListProps> = ({ 
  members,
  currentMonth = new Date().getMonth()
}) => {
  const birthdayMembers = members.filter(member => {
    const birthDate = new Date(member.birthDate);
    return birthDate.getMonth() === currentMonth;
  }).sort((a, b) => {
    const dateA = new Date(a.birthDate);
    const dateB = new Date(b.birthDate);
    return dateA.getDate() - dateB.getDate();
  });

  if (birthdayMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <Cake className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No birthdays this month</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Birthdays in {format(new Date(2024, currentMonth), 'MMMM')}
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {birthdayMembers.map((member) => (
            <li key={member.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <img
                  src={member.photo || 'https://via.placeholder.com/40'}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(member.birthDate), 'MMMM d')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};