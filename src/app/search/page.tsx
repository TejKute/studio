'use client';
import { useState } from 'react';
import AppLayout from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { Card } from '@/components/ui/card';

const allItems = [
    { type: 'Project', name: 'Socialite', description: 'A social media app for connecting with friends.' },
    { type: 'Project', name: 'FitTrack', description: 'A fitness tracking app to monitor workouts.' },
    { type: 'Template', name: 'SaaS Starter', description: 'A starter template for building a SaaS application.' },
    { type: 'Template', name: 'E-commerce Store', description: 'A full-featured e-commerce template.' },
];

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredItems = allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Search</h1>
                    <p className="text-muted-foreground">Find projects, templates, and components.</p>
                </div>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search everything..." 
                        className="pl-10 text-lg h-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="space-y-4">
                    {searchTerm && filteredItems.length > 0 && (
                        <h2 className="text-xl font-semibold">Results</h2>
                    )}
                    <div className="grid gap-4">
                        {searchTerm && filteredItems.map((item, index) => (
                           <Card key={index} className="p-4 flex justify-between items-center hover:bg-muted/50">
                               <div>
                                   <p className="font-semibold">{item.name}</p>
                                   <p className="text-sm text-muted-foreground">{item.description}</p>
                               </div>
                               <div className="text-sm text-muted-foreground">{item.type}</div>
                           </Card>
                        ))}
                    </div>
                    {searchTerm && filteredItems.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">No results found</h3>
                            <p className="text-muted-foreground">Try a different search term.</p>
                        </div>
                    )}
                     {!searchTerm && (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">Search for anything</h3>
                            <p className="text-muted-foreground">Projects, templates, and more will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
