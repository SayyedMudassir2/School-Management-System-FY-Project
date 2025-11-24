'use client';

import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Paperclip, Smile, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday, isSameDay, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type User = {
    id: string;
    name: string;
    avatar: string;
    role: string;
};

type Message = {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
};

type Conversation = {
    id: string;
    userId: string;
    unreadCount: number;
    messages: Message[];
};

type MessagesClientProps = {
  users: User[];
  initialConversations: Conversation[];
};

export function MessagesClient({ users, initialConversations }: MessagesClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(convo => {
      const user = userMap.get(convo.userId);
      return user && user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, userMap]);

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId);
  }, [conversations, selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    const message: Message = {
        id: `M${Date.now()}`,
        senderId: 'T01', // Assuming the current user is a teacher with this ID
        text: newMessage,
        timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(convo => 
        convo.id === selectedConversationId 
            ? { ...convo, messages: [...convo.messages, message], unreadCount: 0 } 
            : convo
    ));
    setNewMessage('');
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  };
  
  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "Attachment feature is a work in progress.",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    if (!isClient) return '';
    const date = new Date(timestamp);
    return format(date, 'p');
  };

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <Card className="glassmorphic grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-12rem)] overflow-hidden">
        {/* Conversation List */}
        <div className="md:col-span-1 border-r border-border/20 h-full flex flex-col">
            <div className="p-4 border-b border-border/20">
                <h2 className="text-xl font-semibold">Chats</h2>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search or start new chat" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                {filteredConversations.map(convo => {
                    const user = userMap.get(convo.userId);
                    if (!user) return null;
                    const lastMessage = convo.messages[convo.messages.length - 1];

                    return (
                        <div key={convo.id} 
                             onClick={() => handleSelectConversation(convo.id)}
                             className={cn(
                                 "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                 selectedConversationId === convo.id ? "bg-muted/50" : "hover:bg-muted/30"
                             )}>
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                                    <p className="text-xs text-muted-foreground shrink-0">{isClient ? formatTimestamp(lastMessage.timestamp) : ''}</p>
                                </div>
                                <div className="flex justify-between items-start">
                                    <p className="text-xs text-muted-foreground truncate">{lastMessage.text}</p>
                                    {convo.unreadCount > 0 && (
                                        <Badge className="h-5 w-5 flex items-center justify-center p-0 shrink-0 bg-green-500 text-white">{convo.unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-3 h-full flex flex-col">
            {selectedConversation ? (
                <>
                <div className="p-4 border-b border-border/20 flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={userMap.get(selectedConversation.userId)?.avatar} />
                        <AvatarFallback>{userMap.get(selectedConversation.userId)?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{userMap.get(selectedConversation.userId)?.name}</h3>
                        <p className="text-xs text-muted-foreground">{userMap.get(selectedConversation.userId)?.role}</p>
                    </div>
                </div>
                <ScrollArea className="flex-1 p-6 bg-muted/20">
                    <div className="space-y-4">
                        {selectedConversation.messages.map((message, index) => {
                            const isMe = message.senderId === 'T01';
                            const prevMessage = selectedConversation.messages[index - 1];
                            const showDateSeparator = !prevMessage || !isSameDay(new Date(message.timestamp), new Date(prevMessage.timestamp));
                            
                            return (
                                <React.Fragment key={message.id}>
                                    {showDateSeparator && (
                                        <div className="flex justify-center my-4">
                                            <Badge variant="secondary" className="shadow-md">
                                                {formatDateSeparator(new Date(message.timestamp))}
                                            </Badge>
                                        </div>
                                    )}
                                    <div className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start")}>
                                        {!isMe && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={userMap.get(message.senderId)?.avatar} />
                                                <AvatarFallback>{userMap.get(message.senderId)?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md",
                                            isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card rounded-bl-none"
                                        )}>
                                            <p className="text-sm">{message.text}</p>
                                            <p className={cn("text-xs mt-1 text-right", isMe ? "text-primary-foreground/70" : "text-muted-foreground")}>{isClient ? format(new Date(message.timestamp), 'p') : ''}</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-border/20 bg-muted/30">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" onClick={handleFileUpload}><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button type="button" variant="ghost" size="icon"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                        <Input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-background"
                            autoComplete="off"
                        />
                        <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
                    </form>
                </div>
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center text-center p-8 bg-muted/20">
                     <div className="relative h-48 w-48 text-primary">
                        <Image src="/images/chat-placeholder.svg" alt="Chat placeholder" fill data-ai-hint="communication illustration"/>
                    </div>
                    <h2 className="text-3xl font-bold mt-6">Aedura Chat</h2>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Send and receive messages with students, parents, and colleagues. Select a chat to get started.
                    </p>
                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Your personal messages are end-to-end encrypted
                    </div>
                </div>
            )}
        </div>
    </Card>
  );
}
