"use client"
import useDimensions from '@/hooks/useDimensions';
import { cn } from '@/lib/utils';
import { ResumeValues } from '@/lib/validation';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { formatDate } from "date-fns"
import { Badge } from './ui/badge';
import { BorderStyles } from '@/app/(main)/editor/BorderStyleButton';

interface ResumePreviewProps {
    resumeData: ResumeValues,
    className: string
}

const ResumePreview = ({ resumeData, className }: ResumePreviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { width: w } = useDimensions(containerRef);
    let width = w


    return (
        <div ref={containerRef} className={cn("bg-white text-black h-fit w-full aspect-[210/297]", className)}>
            {


                <div
                    className={cn("space-y-6 p-6", !width && "invisible")}
                    style={{
                        zoom: (1 / 794) * width,
                    }}
                    id="resumePreviewContent"
                >
                    <PersonalInfoHeader resumeData={resumeData} />
                    <SummarySection resumeData={resumeData} />
                    <WorkExperiences resumeData={resumeData} />
                    <Educations resumeData={resumeData} />
                    <SkillsSection resumeData={resumeData} />
                </div>


            }
        </div>
    );
};

interface ResumeSectionProps {
    resumeData: ResumeValues;
}
function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
    const { photo, firstName, lastName, city, country, phone, email, jobTitle, colorHex, borderStyle } = resumeData;

    const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

    useEffect(() => {
        const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";

        if (objectUrl) setPhotoSrc(objectUrl);
        if (photo === null) setPhotoSrc("");
        return () => URL.revokeObjectURL(objectUrl);

    }, [photo])

    return (
        <div className='flex items-center space-x-6'>
            {
                photoSrc &&
                <Image
                    style={{ borderRadius: borderStyle === BorderStyles.CIRCLE ? "9999px" : borderStyle === BorderStyles.SQUARE ? "0px" : "10px" }}
                    src={photoSrc}
                    alt="sdad"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                />
            }
            <div className="space-y-2.5">
                <div className="space-y-1">
                    <p
                        className="text-3xl font-bold"
                        style={{ color: colorHex, borderColor: colorHex, borderStyle: borderStyle }}

                    >
                        {firstName} {lastName}
                    </p>
                    <p
                        className="font-medium"
                        style={{ color: colorHex, borderColor: colorHex, borderStyle: borderStyle }}

                    >
                        {jobTitle}
                    </p>
                </div>
                <p className="text-xs text-gray-500">
                    {city}
                    {city && country ? ", " : ""}
                    {country}
                    {(city || country) && (phone || email) ? " • " : ""}
                    {[phone, email].filter(Boolean).join(" • ")}
                </p>
            </div>
        </div>
    )
}

interface SummarySectionProps {
    resumeData: ResumeValues;
}

function SummarySection({ resumeData }: SummarySectionProps) {
    const { summary, colorHex } = resumeData;
    if (!summary) return null;
    return (
        <>
            <hr
                className="border-2"
                style={{ borderColor: colorHex }}
            />
            <div className="break-inside-avoid space-y-3">
                <h2 className="font-semibold text-2xl" style={{ color: colorHex }}>Professional Profile</h2>
                <p className="whitespace-pre-line text-muted-foreground text-sm">{summary}</p>
            </div>
        </>
    )

}

interface WorkExperiencesProps {
    resumeData: ResumeValues;
}

function WorkExperiences({ resumeData }: WorkExperiencesProps) {
    const { workExperiences, colorHex } = resumeData;
    if (!workExperiences) return null;
    const existingWorkExperiences = workExperiences.filter((exp) => {
        return Object.entries(exp).filter(Boolean).length > 0;
    })
    if (existingWorkExperiences.length === 0) return null;
    return (
        <>
            <hr
                className="border-2"
                style={{ borderColor: colorHex }}
            />
            <div className="break-inside-avoid space-y-3">
                <h2
                    className="font-semibold text-2xl"
                    style={{ color: colorHex }}
                >Work Experiences</h2>
                <div>
                    {
                        existingWorkExperiences.map((exp, index) => (
                            <div key={index}>
                                <div
                                    style={{ color: colorHex }}
                                    className="flex items-center justify-between text-sm font-semibold">
                                    <span>{exp.position}</span>
                                    {exp.startDate && (
                                        <span>
                                            {formatDate(exp.startDate, "MM/yyyy")} - {" "}
                                            {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold">{exp.company}</p>
                                <div className="text-sm whitespace-pre-line">{exp.description}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )

}
interface EducationsProps {
    resumeData: ResumeValues;
}

function Educations({ resumeData }: EducationsProps) {
    const { educations, colorHex } = resumeData;
    if (!educations) return null;
    const existingWorkExperiences = educations.filter((edu) => {
        return Object.entries(edu).filter(Boolean).length > 0;
    })
    if (!educations.length) return null;
    return (
        <>
            <hr
                className="border-2"
                style={{ borderColor: colorHex }}
            />
            <div className="break-inside-avoid space-y-3">
                <h2
                    className="font-semibold text-2xl"
                    style={{ borderColor: colorHex }}
                >Educations</h2>
                <div>
                    {
                        existingWorkExperiences.map((edu, index) => (
                            <div key={index}>
                                <div
                                    className="flex items-center justify-between text-sm font-semibold"
                                    style={{ borderColor: colorHex }}
                                >
                                    <span>{edu.degree}</span>
                                    {edu.startDate && (
                                        <span>
                                            {formatDate(edu.startDate, "MM/yyyy")}
                                            {edu.endDate ? "- " + formatDate(edu.endDate, "MM/yyyy") : ""}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-semibold">{edu.school}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )

}
function SkillsSection({ resumeData }: ResumeSectionProps) {
    const { skills, colorHex, borderStyle } = resumeData;

    if (!skills?.length) return null;

    return (
        <>
            <hr
                className="border-2"
                style={{ borderColor: colorHex }}
            />
            <div className="break-inside-avoid space-y-3">
                <p
                    className="text-lg font-semibold"
                >
                    Skills
                </p>
                <div className="flex break-inside-avoid flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge
                            key={index}
                            className="rounded-md bg-black text-white hover:bg-black"
                            style={{
                                backgroundColor: colorHex,
                                borderRadius: borderStyle === BorderStyles.CIRCLE ? "9999px" : borderStyle === BorderStyles.SQUARE ? "0px" : "8px"
                            }}

                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    );
}
export default ResumePreview;
