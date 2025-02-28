import ResumePreview from '@/components/ResumePreview';
import { ResumeValues } from '@/lib/validation';
import React from 'react';
import ColorPicker from './ColorPicker';
import { BorderStyleButton } from './BorderStyleButton';
import { cn } from '@/lib/utils';

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeValues: (data: ResumeValues) => void;
    showSmTextEditor: boolean;
    setShowSmTextEditor: (show: boolean) => void;
}
const ResumePreviewSection = ({ resumeData, setResumeValues,showSmTextEditor }: ResumePreviewSectionProps) => {
    return (
        <div className={cn("group overflow-auto relative w-full md:w-1/2 md:flex", !showSmTextEditor && "hidden")}>
            <div className="opacity-50 lg:opacity-100 group-hover:opacity-100 transition-opacity absolute left-1 top-1 flex flex-col gap-3 lg:left-3 lg:top-3">
                <ColorPicker
                    color={resumeData.colorHex}
                    onchange={(color =>
                        setResumeValues({ ...resumeData, colorHex: color.hex }))}
                />
                <BorderStyleButton
                    borderStyle={resumeData.borderStyle}
                    onChange={(borderStyle) => setResumeValues({ ...resumeData, borderStyle })}
                />
            </div>
            <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
                <ResumePreview
                    resumeData={resumeData}
                    className="max-w-2xl shadow-md"
                />
            </div>
        </div>
    );
};

export default ResumePreviewSection;