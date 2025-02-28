import React from 'react';
import { Navbar } from './Navbar';

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar />
            {children}

        </div>);
};

export default MainLayout;