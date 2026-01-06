'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface EventSettings {
    eventName: string;
    eventDate: string;
    registrationsOpen: boolean;
    registrationGoal: number;
}

interface EventContextType {
    eventSettings: EventSettings;
    setEventSettings: (settings: EventSettings) => void;
    loading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const initialSettings: EventSettings = {
    eventName: "Hackathon 2026",
    eventDate: "2026-01-01T09:00",
    registrationsOpen: true,
    registrationGoal: 300,
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [eventSettings, setEventSettingsState] = useState<EventSettings>(initialSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('event_settings');
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                setEventSettingsState({ ...initialSettings, ...parsedSettings });
            } else {
                 localStorage.setItem('event_settings', JSON.stringify(initialSettings));
            }
        } catch (error) {
            localStorage.removeItem('event_settings');
        }
        setLoading(false);
    }, []);

    const setEventSettings = (newSettings: EventSettings) => {
        localStorage.setItem('event_settings', JSON.stringify(newSettings));
        setEventSettingsState(newSettings);
    };

    return (
        <EventContext.Provider value={{ eventSettings, setEventSettings, loading }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
