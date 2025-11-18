
import Image from "next/image";
import { Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const avatars = [
    PlaceHolderImages.find(img => img.id === 'parent-avatar'),
    PlaceHolderImages.find(img => img.id === 'teacher-avatar'),
    PlaceHolderImages.find(img => img.id === 'student-avatar-1'),
    PlaceHolderImages.find(img => img.id === 'student-avatar-2'),
    PlaceHolderImages.find(img => img.id === 'admin-avatar'),
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-primary text-primary-foreground animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Simplifying Every Aspect Of School Operations</h2>
                </div>
                <div className="space-y-8">
                    <p className="text-lg text-primary-foreground/90">
                        As a leading school administration software in India, it simplifies complex workflows and ensures smoother coordination between teachers, admins, and parents.  Empower your school with a unified ERP platform that brings admissions, fees, attendance, and communication under one dashboard.  Save time, improve accuracy, and give every stakeholder a smarter way to manage the academic year.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {avatars.map((avatar, index) => (
                                avatar ? (
                                <Image
                                    key={index}
                                    src={avatar.imageUrl}
                                    alt="Customer avatar"
                                    width={40}
                                    height={40}
                                    data-ai-hint={avatar.imageHint}
                                    className="rounded-full border-2 border-primary"
                                />
                                ) : null
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm font-medium">loved by 5000+ customers</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  src="https://picsum.photos/seed/dashboard/1200/600"
                  alt="App screenshot"
                  width={1200}
                  height={600}
                  data-ai-hint="app dashboard"
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
        </div>
    </section>
  );
}
