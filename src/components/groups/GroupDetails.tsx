import React, { useState } from 'react';
import { Edit2, Trash2, UserPlus, UserMinus, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useStore } from '../../lib/store';
import { toast } from 'sonner';
import type { Group, Member } from '../../lib/store';

interface GroupDetailsProps {
  group: Group;
}

export const GroupDetails: React.FC<GroupDetailsProps> = ({ group }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const store = useStore();
  const members = store.members || [];

  const groupMembers = members.filter(member => 
    group.members.includes(member.id)
  );

  const availableMembers = members.filter(member => 
    !group.members.includes(member.id)
  );

  const handleAddMember = (memberId: string) => {
    store.addMemberToGroup(group.id, memberId);
    toast.success('Member added to group successfully');
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this member from the group?')) {
      store.removeMemberFromGroup(group.id, memberId);
      toast.success('Member removed from group successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
            <p className="text-sm text-gray-500">{group.category}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            group.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {group.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{group.description}</p>

        {group.meetingSchedule && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Meeting Schedule</h3>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Day:</span> {group.meetingSchedule.day}
              </div>
              <div>
                <span className="font-medium">Time:</span> {group.meetingSchedule.time}
              </div>
              <div>
                <span className="font-medium">Location:</span> {group.meetingSchedule.location}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
          <Button
            onClick={() => setIsAddMemberModalOpen(true)}
            icon={UserPlus}
          >
            Add Member
          </Button>
        </div>

        {groupMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No members</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding members to this group
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {groupMembers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={member.photo || 'https://via.placeholder.com/40'}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <UserMinus className="h-5 w-5 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Member to Group"
      >
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {availableMembers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={member.photo || 'https://via.placeholder.com/40'}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleAddMember(member.id);
                    setIsAddMemberModalOpen(false);
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};