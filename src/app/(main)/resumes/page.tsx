import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

export const metaData: Metadata = {
    title: "Your resumes"
}
const ResumesPage = () => {
    return (
        <main className='mx-auto py-6 px-3 w-full space-y-6 max-w-7xl'>
            <Button asChild className='mx-auto flex w-fit gap-2'>
                <Link href="/editor">
                    <PlusSquare />
                    New Resume
                </Link>
            </Button>
        </main>
    );
};

export default ResumesPage;