'use client';
import { useState } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Briefcase, Bot, BookOpen, ShoppingCart, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const templates = [
  { name: 'SaaS Starter', description: 'Begin your subscription service with user auth and billing.', category: 'SaaS', icon: Briefcase },
  { name: 'AI Chatbot', description: 'A template for building your own AI-powered chatbot.', category: 'AI Tools', icon: Bot },
  { name: 'Online Course Platform', description: 'Launch an educational platform with video lessons.', category: 'Education', icon: BookOpen },
  { name: 'E-commerce Storefront', description: 'A full-featured storefront for online retail.', category: 'E-commerce', icon: ShoppingCart },
  { name: 'Productivity Tracker', description: 'A template for a task and goal management app.', category: 'Productivity', icon: BarChart },
];

const categories = ['SaaS', 'AI Tools', 'Education', 'Productivity', 'E-commerce'];

export default function TemplatesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTemplates = templates.filter(template => {
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              template.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tighter">
                        App Templates
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kickstart your next project with a professionally designed template.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search templates..." 
                            className="pl-10 h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <Button variant={selectedCategory === 'All' ? 'secondary' : 'ghost'} onClick={() => setSelectedCategory('All')}>All</Button>
                        {categories.map(category => (
                            <Button key={category} variant={selectedCategory === category ? 'secondary' : 'ghost'} onClick={() => setSelectedCategory(category)}>{category}</Button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template, index) => {
                        const Icon = template.icon;
                        return (
                            <Card key={index} className="flex flex-col hover:border-primary/50 transition-all">
                                <CardHeader className="flex-row items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                                      <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-headline tracking-tight">{template.name}</CardTitle>
                                        <CardDescription className="text-xs">{template.category}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{template.description}</p>
                                </CardContent>
                                <div className="p-4 pt-0">
                                    <Button className="w-full" asChild>
                                        <Link href="/project/new">Use Template</Link>
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
                {filteredTemplates.length === 0 && (
                     <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                        <h3 className="text-lg font-semibold">No templates found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
