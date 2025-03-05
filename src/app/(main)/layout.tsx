import React from 'react';
import { Navbar } from './Navbar';
import PremiumModal from '@/components/premium/PremiumModal';
import SubscriptionLevelProvider from './SubscriptionLevelProvider';
import { getUserSubscriptionLevel } from '@/lib/subscription';
import { auth } from '@clerk/nextjs/server';

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = async ({ children }: MainLayoutProps) => {
    const { userId } = await auth();
    if (!userId) return null;
    const userSubscriptionLevel = await getUserSubscriptionLevel(userId);
    return (
        <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
            <div className='min-h-screen flex flex-col'>
                <Navbar />
                {children}
                <PremiumModal />

            </div></SubscriptionLevelProvider>);
};

export default MainLayout;