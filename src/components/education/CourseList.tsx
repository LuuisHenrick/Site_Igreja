import React, { useState } from 'react';
import { Book, Users, Clock, Folder, Search, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CourseForm } from './CourseForm';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  category: string;
  folder?: string;
  students: number;
  schedule: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  materials?: {
    name: string;
    type: string;
    size: number;
    url: string;
    uploadedAt: string;
  }[];
}

interface FolderStructure {
  [key: string]: Course[];
}

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Foundations of Faith',
    instructor: 'Pastor John Smith',
    description: 'A comprehensive introduction to Christian faith and practices.',
    category: 'Bible Study',
    folder: 'Biblical Studies',
    students: 25,
    schedule: 'Sundays, 9:00 AM',
    status: 'ongoing'
  },
  {
    id: '2',
    title: 'Biblical Leadership',
    instructor: 'Dr. Sarah Johnson',
    description: 'Developing effective leadership skills based on biblical principles.',
    category: 'Leadership',
    folder: 'Leadership Training',
    students: 18,
    schedule: 'Wednesdays, 7:00 PM',
    status: 'ongoing'
  },
  {
    id: '3',
    title: 'New Testament Survey',
    instructor: 'Rev. Michael Brown',
    description: 'A comprehensive overview of the New Testament.',
    category: 'Bible Study',
    folder: 'Biblical Studies',
    students: 30,
    schedule: 'Starting Next Month',
    status: 'upcoming'
  }
];

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = Array.from(new Set(courses.map(course => course.category)));
  const folders = Array.from(new Set(courses.filter(c => c.folder).map(c => c.folder!)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const coursesByFolder = filteredCourses.reduce((acc: FolderStructure, course) => {
    const folder = course.folder || 'Uncategorized';
    if (!acc[folder]) {
      acc[folder] = [];
    }
    acc[folder].push(course);
    return acc;
  }, {});

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const handleAddCourse = (data: any) => {
    const newCourse: Course = {
      id: Math.random().toString(36).substring(2),
      ...data,
      students: 0,
      schedule: 'Not scheduled',
      status: 'upcoming'
    };
    setCourses([...courses, newCourse]);
    setIsAddModalOpen(false);
    toast.success('Course created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Add Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(coursesByFolder).map(([folder, folderCourses]) => (
          <div key={folder} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => toggleFolder(folder)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">{folder}</h3>
                <span className="text-sm text-gray-500">
                  ({folderCourses.length} {folderCourses.length === 1 ? 'course' : 'courses'})
                </span>
              </div>
              {expandedFolders.has(folder) ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedFolders.has(folder) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="divide-y divide-gray-200">
                    {folderCourses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Book className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                              <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>
                              <p className="mt-1 text-sm text-gray-600">{course.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              {course.students} students
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.schedule}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.status === 'ongoing'
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'upcoming'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        {course.materials && course.materials.length > 0 && (
                          <div className="mt-4 pl-16">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Course Materials</h4>
                            <ul className="space-y-2">
                              {course.materials.map((material, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600">
                                  <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:text-indigo-600"
                                  >
                                    <Book className="h-4 w-4 mr-2" />
                                    {material.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Course"
      >
        <CourseForm
          onSubmit={handleAddCourse}
          existingFolders={folders}
        />
      </Modal>
    </div>
  );
};