
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SmallTitle } from "./small-title";

const features = [
    {
      title: "Student Information System",
      description: "It's a centralized student data management system with digital enrollment, profile tracking, and academic records in one secure location.",
      image: "https://picsum.photos/seed/feature1/600/400",
      hint: "student records"
    },
    {
      title: "Academic Excellence Suite",
      description: "There are comprehensive tools for curriculum planning, examination management, and automated grading with detailed performance analytics.",
      image: "https://picsum.photos/seed/feature2/600/400",
      hint: "academic performance"
    },
    {
      title: "Communication Hub",
      description: "It's an integrated messaging system with multi-channel support for announcements, parent-teacher communication, and student collaboration.",
      image: "https://picsum.photos/seed/feature3/600/400",
      hint: "communication channels"
    },
    {
      title: "Financial Management",
      description: "It's a complete fee management system with online payment gateways, invoice generation, and expense tracking for transparent accounting.",
      image: "https://picsum.photos/seed/feature4/600/400",
      hint: "financial system"
    },
    {
      title: "Attendance & Timetable",
      description: "There's automated attendance tracking for students and staff, coupled with a dynamic timetable generator for efficient scheduling.",
      image: "https://picsum.photos/seed/feature5/600/400",
      hint: "attendance tracking"
    },
    {
      title: "Analytics & Reports",
      description: "There are powerful analytics tools to generate insightful reports on academic performance, attendance trends, and financial data for data-driven decisions.",
      image: "https://picsum.photos/seed/feature6/600/400",
      hint: "data analytics"
    }
  ];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-secondary/50 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <SmallTitle>Features</SmallTitle>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-4">All-in-One School Management Platform</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                You can streamline your entire school operations with our comprehensive suite of integrated modules designed specifically for modern educational institutions.
            </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="glassmorphic overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                <div className="mt-4 -mx-2 rounded-lg bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10">
                    <Image
                        src={feature.image}
                        alt={feature.title}
                        width={600}
                        height={400}
                        data-ai-hint={feature.hint}
                        className="rounded-md shadow-md"
                    />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
