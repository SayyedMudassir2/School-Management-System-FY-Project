
'use client';

import Image from "next/image";
import { Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SmallTitle } from "./small-title";

const avatars = [
    PlaceHolderImages.find(img => img.id === 'parent-avatar'),
    PlaceHolderImages.find(img => img.id === 'teacher-avatar'),
    PlaceHolderImages.find(img => img.id === 'student-avatar-1'),
    PlaceHolderImages.find(img => img.id === 'student-avatar-2'),
    PlaceHolderImages.find(img => img.id === 'admin-avatar'),
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-secondary/30 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
                <SmallTitle>Testimonials</SmallTitle>
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mt-4">Simplifying Every Aspect Of School Operations</h2>
                <p className="mt-6 text-lg text-muted-foreground">
                    As a leading school administration software, Aedura simplifies complex workflows and ensures smoother coordination between teachers, admins, and parents.  Empower your school with a unified ERP platform that brings admissions, fees, attendance, and communication under one dashboard.  Save time, improve accuracy, and give every stakeholder a smarter way to manage the academic year.
                </p>
                <div className="mt-8 flex justify-center items-center gap-4">
                    <div className="flex -space-x-4">
                        {avatars.map((avatar, index) => (
                            avatar ? (
                            <Image
                                key={index}
                                src={avatar.imageUrl}
                                alt="Customer avatar"
                                width={48}
                                height={48}
                                data-ai-hint={avatar.imageHint}
                                className="rounded-full border-2 border-background object-cover h-12 w-12"
                            />
                            ) : null
                        ))}
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-sm font-medium">Loved by 5000+ customers</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
