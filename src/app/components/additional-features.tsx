
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SmallTitle } from './small-title';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Banknote, BarChart, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const featuresData = [
  {
    id: 'students',
    name: 'Students',
    icon: Users,
    title: 'Student Management',
    description: 'It\'s a comprehensive student information system for managing enrollments, profiles, and academic records with ease.',
    points: [
      'Digital student profiles with complete academic history',
      'Automated enrollment and registration process',
      'Parent portal access with real-time updates',
      'Student performance tracking and analytics',
      'Digital document management for student records',
      'Bulk student data import/export capabilities',
    ],
    image: 'https://picsum.photos/seed/students/800/600',
    hint: 'student information',
    cta: 'Learn more about Student Management'
  },
  {
    id: 'academics',
    name: 'Academics',
    icon: GraduationCap,
    title: 'Academic Excellence',
    description: 'You can streamline curriculum planning, assessments, and progress reporting to foster academic growth and success.',
    points: [
      'Centralized curriculum and subject management',
      'Online examination and automated grading system',
      'Customizable report cards with performance analytics',
      'Lesson planning and resource sharing for teachers',
      'Timetable generation and management',
      'Homework and assignment tracking',
    ],
    image: 'https://picsum.photos/seed/academics/800/600',
    hint: 'academic curriculum',
    cta: 'Learn more about Academics'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: Banknote,
    title: 'Financial Control',
    description: 'You can simplify fee collection, expense tracking, and financial reporting with our integrated accounting module.',
    points: [
      'Automated fee invoicing and online payment gateways',
      'Customizable fee structures and concession management',
      'Real-time tracking of revenue and expenses',
      'Payroll and salary management for staff',
      'Financial reporting and budget analysis',
      'Secure and transparent transaction records',
    ],
    image: 'https://picsum.photos/seed/finance/800/600',
    hint: 'financial accounting',
    cta: 'Learn more about Finance'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart,
    title: 'Data-Driven Insights',
    description: 'You can leverage powerful analytics to gain actionable insights into every aspect of your institution’s performance.',
    points: [
      'Interactive dashboards for a 360-degree view',
      'Attendance and behavioral trend analysis',
      'Academic performance and subject-wise analytics',
      'Financial health and fee collection reports',
      'Admission and enrollment trend analysis',
      'Custom report builder for specific data needs',
    ],
    image: 'https://picsum.photos/seed/analytics/800/600',
    hint: 'data dashboard',
    cta: 'Learn more about Analytics'
  },
];

export function AdditionalFeatures() {
  const [activeTab, setActiveTab] = useState(featuresData[0].id);
  const activeFeature = featuresData.find(f => f.id === activeTab) || featuresData[0];

  return (
    <section id="additional-features" className="py-24 sm:py-32 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <SmallTitle>Additional Features</SmallTitle>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-4">All-in-One School Management Platform</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                You can streamline your entire school operations with our comprehensive suite of integrated modules designed specifically for modern educational institutions.
            </p>
        </div>

        <div className="mt-16">
          <div className="border-b border-border/50 mb-8">
            <div className="flex justify-center -mb-px overflow-x-auto">
              {featuresData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">{activeFeature.title}</h3>
              <p className="text-muted-foreground">{activeFeature.description}</p>
              <ul className="space-y-4">
                {activeFeature.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg">{activeFeature.cta}</Button>
            </div>
            <div className="animate-in fade-in-0 zoom-in-95 duration-500">
                <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
                    <Image
                        src={activeFeature.image}
                        alt={activeFeature.title}
                        width={800}
                        height={600}
                        data-ai-hint={activeFeature.hint}
                        className="rounded-md shadow-lg"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
