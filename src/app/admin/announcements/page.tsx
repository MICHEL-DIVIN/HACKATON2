'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Megaphone, PlusCircle } from "lucide-react";
import { useAnnouncements, type Announcement } from "@/context/announcements-context";

export default function AnnouncementsPage() {
    const { announcements, addAnnouncement } = useAnnouncements();
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    const handleAddAnnouncement = () => {
        if (!newTitle || !newContent) return;
        const newAnnouncement: Announcement = {
            id: announcements.length + 1,
            title: newTitle,
            content: newContent,
            date: new Date().toISOString().split('T')[0],
        };
        addAnnouncement(newAnnouncement);
        setNewTitle("");
        setNewContent("");
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 md:p-8 space-y-8">
                 <h1 className="text-3xl font-bold font-headline">Annonces</h1>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlusCircle />
                                Créer une nouvelle annonce
                            </CardTitle>
                            <CardDescription>Elle sera visible par tous les participants.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input 
                                placeholder="Titre de l'annonce" 
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <Textarea 
                                placeholder="Contenu de l'annonce..." 
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={5}
                            />
                            <Button onClick={handleAddAnnouncement} className="w-full">
                                Publier l'annonce
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold font-headline">Annonces récentes</h2>
                        {[...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(announcement => (
                             <Card key={announcement.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                    <CardDescription>{new Date(announcement.date).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{announcement.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
