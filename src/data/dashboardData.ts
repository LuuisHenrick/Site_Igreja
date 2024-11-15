import { Users, UserPlus, BookOpen, DollarSign, Package, Calendar, Image, Bell } from 'lucide-react';

export const stats = [
  { label: 'Total Members', value: '1,234', trend: '+12%' },
  { label: 'Weekly Attendance', value: '856', trend: '+5%' },
  { label: 'Active Groups', value: '45', trend: '+2%' },
  { label: 'Monthly Donations', value: '$24,500', trend: '+8%' }
];

export const quickActions = [
  { icon: UserPlus, label: 'Add Member' },
  { icon: Calendar, label: 'Schedule Event' },
  { icon: DollarSign, label: 'Record Donation' },
  { icon: Bell, label: 'Send Notification' }
];

export const modules = [
  { icon: Users, label: 'Member Management', description: 'Manage church members and their information' },
  { icon: BookOpen, label: 'Education', description: 'Bible studies and discipleship programs' },
  { icon: DollarSign, label: 'Finance', description: 'Track donations and manage expenses' },
  { icon: Package, label: 'Assets', description: 'Manage church properties and equipment' },
  { icon: Calendar, label: 'Calendar', description: 'Schedule and manage church events' },
  { icon: Image, label: 'Media', description: 'Photos, videos, and documents' }
];

export const upcomingEvents = [
  { title: 'Sunday Service', date: 'Sunday, 10:00 AM', attendees: 450 },
  { title: 'Youth Meeting', date: 'Friday, 7:00 PM', attendees: 120 },
  { title: 'Bible Study', date: 'Wednesday, 6:30 PM', attendees: 85 }
];