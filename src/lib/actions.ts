"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { resumeSchema, ResumeValues } from "./validation";
import { del, put } from "@vercel/blob";
import path from "path";

export const saveResume = async (resumeData: ResumeValues) => {
  const { id } = resumeData;
  const { educations, photo, workExperiences, ...resValues } =
    resumeSchema.parse(resumeData);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id } })
    : null;
  if (id && !existingResume) {
    throw new Error("Resume not found");
  }
  let newPhotoUrl: string | null | undefined = undefined;
  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }
  if(id){
    await prisma.resume.update({
      where: { id },
      data: {
        ...resValues,
        photoUrl: newPhotoUrl,
        educations: {
          deleteMany: {},
          create: educations?.map((education) => ({
            ...education,
            startDate:education.startDate? new Date(education.startDate):undefined,
            endDate:education.endDate? new Date(education.endDate):undefined
        })),
        },
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((we) => ({
            ...we,
            startDate:we.startDate? new Date(we.startDate):undefined,
            endDate:we.endDate? new Date(we.endDate):undefined
        })),

        },
        updatedAt: new Date(),
      },
    });
  } else {
   return await prisma.resume.create({
      data: {
        ...resValues,
        photoUrl: newPhotoUrl,
        educations: {
          create: workExperiences?.map((we) => ({
            ...we,
            startDate:we.startDate? new Date(we.startDate):undefined,
            endDate:we.endDate? new Date(we.endDate):undefined
        })),
        },
        workExperiences: {
          create: workExperiences?.map((we) => ({
            ...we,
            startDate:we.startDate? new Date(we.startDate):undefined,
            endDate:we.endDate? new Date(we.endDate):undefined
        })),

        },
        userId,
      },
    });
  }
};
