
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LifeBuoy, ArrowRight } from 'lucide-react';
import { PageHeader } from '../dashboard/components/page-header';
import { Footer } from '../components/footer';
import { Logo } from '@/components/logo';
import { DesktopNav } from '../components/desktop-nav';
import { MobileNav } from '../components/mobile-nav';

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click the 'Forgot your password?' link. You will receive an email with instructions on how to create a new password."
    },
    {
        question: "How can I view my child's grades and attendance?",
        answer: "As a parent, log in to your dashboard to see your child's academic progress. The 'Attendance' and 'Grades' sections are available in the main menu."
    },
    {
        question: "Where can I find the school calendar?",
        answer: "The school calendar, which includes all important dates, holidays, and events, can be found in the 'Calendar' or 'Events' section of your dashboard."
    },
    {
        question: "How do I make a fee payment online?",
        answer: "Navigate to the 'Fees Management' section in your dashboard. You'll find a list of outstanding invoices with an option to pay securely online using various payment methods."
    },
    {
        question: "Who should I contact for technical support?",
        answer: "If you encounter any technical issues, please reach out to our support team by using the contact form at the bottom of this page or by emailing support@aedura.elite."
    }
];

export default function HelpPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
             <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/30 backdrop-blur-lg">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    </Link>
                    <DesktopNav />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                    <Button asChild className="group">
                        <Link href="/login">
                        Login <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                    </div>
                    <MobileNav />
                </div>

                </div>
            </header>

            <main className="flex-1 py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Help Center</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            Find answers to frequently asked questions and get in touch with our support team.
                        </p>
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto">
                        <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                                            <AccordionContent>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        <Card className="glassmorphic mt-12">
                            <CardHeader>
                                <CardTitle>Still Need Help?</CardTitle>
                                <CardDescription>If you can't find the answer you're looking for, please don't hesitate to contact us.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row gap-4">
                                     <Button asChild size="lg" className="flex-1">
                                        <Link href="/#contact">Contact Support</Link>
                                    </Button>
                                     <Button variant="outline" size="lg" className="flex-1">
                                        Email us at support@aedura.elite
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer year={null} />
        </div>
    );
}
