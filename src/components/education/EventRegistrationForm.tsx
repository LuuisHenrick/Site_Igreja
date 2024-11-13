import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import type { EducationEvent } from '../../lib/store';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  additionalParticipants: z.number()
    .min(0, 'Cannot be negative')
    .max(10, 'Maximum 10 additional participants'),
  specialRequirements: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface EventRegistrationFormProps {
  event: EducationEvent;
  onSubmit: (data: RegistrationFormData) => void;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  event,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      additionalParticipants: 0,
      agreeToTerms: false,
    },
  });

  const additionalParticipants = watch('additionalParticipants', 0);
  const totalParticipants = 1 + additionalParticipants;
  const totalCost = event.isFree ? 0 : (event.price || 0) * totalParticipants;

  return (
    <div className="space-y-8">
      {/* Event Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        {event.subtitle && (
          <p className="mt-1 text-sm text-gray-500">{event.subtitle}</p>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(`${event.date}T${event.time}`), 'PPp')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            {event.isFree ? 'Free' : `$${event.price?.toFixed(2)} per person`}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {event.registrations.length} registered
            {event.maxParticipants && ` / ${event.maxParticipants} max`}
          </div>
        </div>

        {event.description && (
          <p className="mt-4 text-sm text-gray-600">{event.description}</p>
        )}
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Participants
            </label>
            <input
              type="number"
              min="0"
              max="10"
              {...register('additionalParticipants', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.additionalParticipants && (
              <p className="mt-1 text-sm text-red-600">{errors.additionalParticipants.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Special Requirements or Notes
          </label>
          <textarea
            {...register('specialRequirements')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Any dietary restrictions, accessibility needs, or other special requirements..."
          />
        </div>

        {/* Registration Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900">Registration Summary</h4>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Number of Participants:</span>
              <span>{totalParticipants}</span>
            </div>
            {!event.isFree && (
              <>
                <div className="flex justify-between">
                  <span>Cost per Person:</span>
                  <span>${event.price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('agreeToTerms')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            I agree to the terms and conditions and confirm that the information provided is accurate
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
};