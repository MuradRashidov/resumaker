import { Button } from '@/components/ui/button';
import React from 'react';
import { steps } from './steps';
import Link from 'next/link';
import { PenLine, TextIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
    showSmTextEditor: boolean;
    setShowSmTextEditor: (show: boolean) => void;
    isaving: boolean;


}

export const Footer = ({ currentStep, setCurrentStep, setShowSmTextEditor, showSmTextEditor,isaving }: FooterProps) => {
    const prevStep = steps.find((_, i) => steps[i+1]?.key === currentStep)?.key
    const nextStep = steps.find((_, i) => steps[i-1]?.key === currentStep)?.key
    return (
        <footer className='px-3 py-5 border-t w-full'>
            <div className='max-w-7xl mx-auto flex flex-wrap justify-between gap-y-3'>
                <div className="flex items-center gap-3">
                    <Button disabled={!prevStep} onClick={() => prevStep && setCurrentStep(prevStep)} variant="secondary">Previous step</Button>
                    <Button disabled={!nextStep} onClick={()=> {nextStep && setCurrentStep(nextStep)}}>Next step</Button>
                </div>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSmTextEditor(!showSmTextEditor)}
                  title={showSmTextEditor ? "Edit" : "Show"}
                >
                   {showSmTextEditor ? <PenLine/> : <TextIcon/>} 
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" asChild>
                        <Link href="/resumes">Close</Link>
                    </Button>
                    <p className={cn('opacity-0 text-muted-foreground',isaving && "opacity-100")}>Saving...</p>
                </div>
            </div>
        </footer>
    );
};