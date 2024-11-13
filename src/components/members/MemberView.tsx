import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';

interface MemberViewProps {
  member: Member;
  onEdit: () => void;
}

export const MemberView: React.FC<MemberViewProps> = ({ member, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={member.photo || 'https://via.placeholder.com/100'}
            alt={member.name}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
            <p className="text-sm text-gray-500">Member ID: {member.id}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          icon={Edit2}
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{member.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900">{member.phone}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Church Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="text-sm text-gray-900">{member.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="text-sm text-gray-900">{member.category}</dd>
            </div>
            {member.position && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="text-sm text-gray-900">{member.position}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Address</h3>
        <address className="mt-2 not-italic text-sm text-gray-900">
          {member.address.street}, {member.address.number}<br />
          {member.address.neighborhood}<br />
          {member.address.city}, {member.address.state}<br />
          CEP: {member.address.cep}
        </address>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Birth Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(member.birthDate)}</dd>
            </div>
            {member.conversionDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Conversion Date</dt>
                <dd className="text-sm text-gray-900">{formatDate(member.conversionDate)}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Baptism Status</dt>
              <dd className="text-sm text-gray-900">
                {member.isBaptized ? (
                  <>
                    Baptized on {formatDate(member.baptismDate!)}
                  </>
                ) : (
                  'Not Baptized'
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">System Information</h3>
          <dl className="mt-2 space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">{member.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="text-sm text-gray-900">{formatDate(member.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {member.permissions?.map(permission => (
            <div
              key={permission}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm"
            >
              {permission}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};