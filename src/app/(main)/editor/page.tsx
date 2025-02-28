import { Metadata } from "next";
import { ResumeEditor } from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";

const metaData: Metadata = {
    title: "Make your resume"
}
type ResumeProps = {
    searchParams: Promise<{ resumeId?: string  }>
}
export default async function ({ searchParams }: ResumeProps) {
    const { resumeId } = await searchParams;
    const { userId } = await auth();
    if (!userId) 
        return null;
    const editedResume = resumeId ? await prisma.resume.findUnique({
        where:{
            id: resumeId,
            userId
        },
        include: resumeDataInclude
    }): null;
    return <ResumeEditor resumeToEdit={editedResume} />
}