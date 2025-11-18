
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowRight, ChevronDown, BookOpen, Users, Banknote, LayoutDashboard } from 'lucide-react';

const features = [
  {
    name: 'Attendance Tracking',
    description: 'Monitor student attendance with ease.',
    href: '#',
    icon: Users,
  },
  {
    name: 'Fee Management',
    description: 'Streamline fee collection and reporting.',
    href: '#',
    icon: Banknote,
  },
  {
    name: 'Gradebooks',
    description: 'Manage grades and academic performance.',
    href: '#',
    icon: BookOpen,
  },
  {
    name: 'Dashboards',
    description: 'Get a complete overview of your institution.',
    href: '/dashboard',
    icon: LayoutDashboard,
  }
];

export function DesktopNav() {
  return (
    <>
    <nav className="hidden md:flex items-center gap-6">
      <a
        href="#home"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Home
      </a>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none">
            Features
            <ChevronDown className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Features</h4>
              <p className="text-sm text-muted-foreground">
                Everything you need to manage your school.
              </p>
            </div>
            <div className="grid gap-2">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="-m-3 flex items-start rounded-lg p-3 hover:bg-muted"
                >
                  <feature.icon className="h-6 w-6 flex-shrink-0 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-foreground">
                      {feature.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t pt-4">
                <Button asChild className="w-full">
                    <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <a
        href="#testimonials"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Testimonials
      </a>
      <a
        href="#contact"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Contact
      </a>
    </nav>
     <div className="hidden md:flex items-center gap-2">
        <Button asChild>
          <Link href="/login">
            Login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
