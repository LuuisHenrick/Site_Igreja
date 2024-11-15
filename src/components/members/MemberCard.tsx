import React from 'react';
import { Download, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { generatePDF } from '../../utils/pdfGenerator';
import type { Member } from '../../lib/store';

interface MemberCardProps {
  member: Member;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const handleDownloadCard = async () => {
    await generatePDF(member);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Front of the card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-12 left-4">
            <img
              src={member.photo || 'https://via.placeholder.com/100'}
              alt={member.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
        <div className="pt-16 p-4">
          <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
          <p className="text-sm text-gray-500">{member.role}</p>
          
          <div className="mt-4 space-y-2">
            {member.baptismDate && (
              <div className="text-sm">
                <span className="font-medium">Baptism Date:</span>{' '}
                {format(new Date(member.baptismDate), 'PPP')}
              </div>
            )}
            {member.conversionDate && (
              <div className="text-sm">
                <span className="font-medium">Conversion Date:</span>{' '}
                {format(new Date(member.conversionDate), 'PPP')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back of the card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {member.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {member.phone}
          </div>
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-1" />
            <div>
              {member.address.street}, {member.address.number}<br />
              {member.address.neighborhood}<br />
              {member.address.city}, {member.address.state}<br />
              CEP: {member.address.cep}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Heart className="h-4 w-4 mr-2" />
            {member.maritalStatus || 'Not specified'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleDownloadCard}
          icon={Download}
        >
          Download Card
        </Button>
      </div>
    </div>
  );
};