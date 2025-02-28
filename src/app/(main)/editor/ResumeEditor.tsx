"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import GeneralInfoForm from './forms/GeneralInfoForm';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { useSearchParams } from 'next/navigation';
import { steps } from './steps';
import Breadcrumbs from './BreadCrumbs';
import { Footer } from './Footer';
import { ResumeValues } from '@/lib/validation';
import ResumePreviewSection from './ResumePreviewSection';
import { cn, fileReplacer, mapToResumeValues } from '@/lib/utils';
import useUnloadWarning from '@/hooks/useUnloadWarning';
import useAutoSaveResume from './useAutoSaveResume';
import { ResumeServerData } from '@/lib/types';

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
}

export const ResumeEditor = ({
    resumeToEdit
}: ResumeEditorProps) => {

    const [resumeData, setResumeData] = useState<ResumeValues>(resumeToEdit ? mapToResumeValues(resumeToEdit) : {});
    const searchParams = useSearchParams();

    const currentStep = searchParams.get("step") || steps[0].key;

    function setStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("step", key);
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }
    const [showSmTextEditor, setShowSmTextEditor] = useState(false);
    const FormComponent = steps.find(
        (step) => step.key === currentStep,
    )?.component;
    const { hasUnsavedChanges, isSaving } = useAutoSaveResume(resumeData);
    useUnloadWarning(hasUnsavedChanges);
    return (
        <div className='flex grow flex-col'>
            <header className="space-y-1.5 border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">
                    Make your resume
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Follow the steps below to make your resume. Your progress will be saved automatically.
                </p>
            </header>
            <main className='relative grow'>
                <div className='absolute bottom-0 top-0 flex w-full'>

                    <div className={cn("w-full p-3 md:w-1/2 overflow-y-auto space-y-6", showSmTextEditor && "hidden")}>
                        <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
                        {FormComponent && (
                            <FormComponent resumeData={resumeData} setResumeData={setResumeData} />
                        )}
                    </div>

                    <div className={cn("grow md:border-r", !setShowSmTextEditor && "hidden")} />
                    <ResumePreviewSection
                        resumeData={resumeData}
                        setResumeValues={setResumeData}
                        setShowSmTextEditor={setShowSmTextEditor}
                        showSmTextEditor={showSmTextEditor}
                    />
                </div>
            </main>
            <Footer
                setShowSmTextEditor={setShowSmTextEditor}
                showSmTextEditor={showSmTextEditor}
                currentStep={currentStep}
                setCurrentStep={setStep}
                isaving={isSaving}
            />

        </div>
    );
};