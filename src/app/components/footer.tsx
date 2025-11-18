
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
];

const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Linkedin", icon: Linkedin, href: "#" },
    { name: "Youtube", icon: Youtube, href: "#" },
];

export function Footer({ year }: { year: number | null }) {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-sm">
            <TooltipProvider>
                <div className="container mx-auto px-6 py-12 lg:py-16">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        <div className="lg:col-span-1">
                            <Logo />
                            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                                Aedura is our school’s centralized, all-in-one digital system.  It's designed to simplify communication, academics, administration, and daily school operations.
                            </p>
                            <div className="mt-6 flex space-x-4">
                                {socialLinks.map((social) => (
                                    <Tooltip key={social.name}>
                                        <TooltipTrigger asChild>
                                            <a href={social.href} className="text-muted-foreground hover:text-primary">
                                                <span className="sr-only">{social.name}</span>
                                                <social.icon className="h-6 w-6" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{social.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
                            <div>
                                <h3 className="font-semibold text-foreground">Get In Touch</h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><a href="mailto:contact@aedura.elite" className="text-muted-foreground hover:text-primary">contact@aedura.elite</a></li>
                                    <li><a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">(123) 456-7890</a></li>
                                    <li className="text-muted-foreground">123 Education Lane, Knowledge City</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Quick Links</h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    {quickLinks.map((link) => (
                                        <li key={link.name}>
                                            <a href={link.href} className="text-muted-foreground hover:text-primary">{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <h3 className="font-semibold text-foreground">Newsletter</h3>
                                <p className="mt-4 text-sm text-muted-foreground">Stay updated with our latest news and announcements.</p>
                                <form className="mt-4 flex w-full max-w-sm items-center gap-2">
                                    <Input type="email" placeholder="Enter email..." className="flex-1" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="submit" size="icon" aria-label="Subscribe to newsletter">
                                                <ArrowRight />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Subscribe</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; {year || new Date().getFullYear()} Aedura Elite.  All Rights Reserved.</p>
                    </div>
                </div>
            </TooltipProvider>
        </footer>
    );
}
