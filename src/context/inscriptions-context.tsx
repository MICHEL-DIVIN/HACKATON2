'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Inscription } from '@/components/registration-form';

interface InscriptionsContextType {
    inscriptions: Inscription[];
    addInscription: (inscription: Inscription) => void;
    loading: boolean;
}

const InscriptionsContext = createContext<InscriptionsContextType | undefined>(undefined);

export const InscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedInscriptions = localStorage.getItem('inscriptions');
            if (storedInscriptions) {
                setInscriptions(JSON.parse(storedInscriptions));
            }
        } catch (error) {
            localStorage.removeItem('inscriptions');
        }
        setLoading(false);
    }, []);

    const addInscription = (inscription: Inscription) => {
        setInscriptions(prevInscriptions => {
            const updatedInscriptions = [inscription, ...prevInscriptions];
            localStorage.setItem('inscriptions', JSON.stringify(updatedInscriptions));
            return updatedInscriptions;
        });
    };

    return (
        <InscriptionsContext.Provider value={{ inscriptions, addInscription, loading }}>
            {children}
        </InscriptionsContext.Provider>
    );
};

export const useInscriptions = () => {
    const context = useContext(InscriptionsContext);
    if (context === undefined) {
        throw new Error('useInscriptions doit être utilisé dans un InscriptionsProvider');
    }
    return context;
};
