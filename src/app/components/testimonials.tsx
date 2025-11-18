
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const parentAvatar = PlaceHolderImages.find(img => img.id === 'parent-avatar');
const teacherAvatar = PlaceHolderImages.find(img => img.id === 'teacher-avatar');
const studentAvatar = PlaceHolderImages.find(img => img.id === 'student-avatar-1');

const testimonials = [
    { 
        name: 'Sarah L.', 
        role: 'Parent', 
        text: "Aedura Elite has been a transformative experience for my child.  The teachers are incredible, and the focus on holistic development is truly commendable.", 
        avatar: parentAvatar?.imageUrl, 
        hint: parentAvatar?.imageHint 
    },
    { 
        name: 'John D.', 
        role: 'Teacher', 
        text: "Teaching here is a joy.  The administration is supportive, the students are eager to learn, and the technology integration makes our job easier and more effective.", 
        avatar: teacherAvatar?.imageUrl, 
        hint: teacherAvatar?.imageHint 
    },
    { 
        name: 'Michael C.', 
        role: 'Student, Class of 2024', 
        text: "I feel prepared for whatever comes next.  The school provided me with not just knowledge, but also with problem-solving skills and confidence.", 
        avatar: studentAvatar?.imageUrl, 
        hint: studentAvatar?.imageHint 
    },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Our Community Says</h2>
            <p className="mt-4 text-lg text-muted-foreground">Here's feedback from those who know us best.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="glassmorphic text-center transition-all duration-300 hover:scale-105 hover:shadow-xl mx-4 sm:mx-0">
                <CardContent className="pt-6">
                {testimonial.avatar && <Image src={testimonial.avatar} alt={testimonial.name} width={80} height={80} data-ai-hint={testimonial.hint || ''} className="rounded-full mx-auto mb-4 object-cover w-20 h-20" />}
                <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <blockquote className="text-muted-foreground italic px-4">"{testimonial.text}"</blockquote>
                <p className="mt-4 font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </section>
  );
}
