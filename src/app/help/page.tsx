
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { LifeBuoy, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

const helpArticles = [
    {
        title: "Getting Started Guide",
        description: "Learn the basics of using our platform",
        href: "#"
    },
    {
        title: "Account Management",
        description: "How to manage your account settings",
        href: "#"
    },
    {
        title: "Troubleshooting Common Issues",
        description: "Solutions to frequent problems",
        href: "#"
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
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Help Center & Resources</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                            Find answers, learn best practices, and discover how to get the most out of your Aedura system. Browse through our frequently asked questions or explore our helpful articles to enhance your experience.
                        </p>
                    </div>
                    
                    <div className="mt-16 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4">Help Articles</h2>
                        <div className="relative mb-8">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search articles..." className="pl-10 h-12 text-base" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {helpArticles.map(article => (
                                <Link href={article.href} key={article.title}>
                                    <Card className="glassmorphic h-full hover:bg-muted/30 transition-colors">
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-foreground">{article.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-24 bg-secondary/30 rounded-xl p-8 md:p-16">
                         <div className="max-w-3xl mx-auto">
                            <div className="text-center">
                                <p className="font-semibold text-primary">FREQUENTLY ASKED QUESTIONS</p>
                                <h2 className="text-3xl sm:text-4xl font-bold mt-2">You ask? We answer</h2>
                            </div>
                            <Accordion type="single" collapsible className="w-full mt-8">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="bg-background/50 rounded-lg px-6 mb-2">
                                        <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    <Card className="glassmorphic mt-24 max-w-3xl mx-auto">
                        <CardHeader className="text-center">
                            <LifeBuoy className="mx-auto h-8 w-8 text-primary" />
                            <CardTitle className="mt-2">Still Need Help?</CardTitle>
                            <CardDescription>If you can't find the answer you're looking for, please don't hesitate to contact us.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                    <Button asChild size="lg" className="flex-1">
                                    <Link href="/#contact">Contact Support</Link>
                                </Button>
                                    <Button variant="outline" size="lg" className="flex-1" asChild>
                                    <a href="mailto:support@aedura.elite">Email us at support@aedura.elite</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer year={null} />
        </div>
    );
}
