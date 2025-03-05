"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { resumeSchema, ResumeValues } from "./validation";
import { del, put } from "@vercel/blob";
import path from "path";
import { Resume } from "@prisma/client";
import { getUserSubscriptionLevel } from "./subscription";
import { canCreateResume, canUseCustomizations } from "./permissions";
import { env } from "@/env";

export const saveResume = async (resumeData: ResumeValues):Promise<ResumeValues> => {
  const { id } = resumeData;
  const { educations, photo, workExperiences, ...resValues } =
    resumeSchema.parse(resumeData);
   console.log("resumeId: ", id);
   
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const subscriptionLevel = await getUserSubscriptionLevel(userId);
  if(!id){
   const resumeCount = await prisma.resume.count({ where: { userId } });
   if(!canCreateResume(subscriptionLevel,resumeCount)) throw new Error("You have reached the limit of resumes you can create");
  }
  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;
  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  const hasCustomizations =
    (resValues.borderStyle &&
      resValues.borderStyle !== existingResume?.borderStyle) ||
    (resValues.colorHex &&
      resValues.colorHex !== existingResume?.colorHex);

  if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level");
  }
  let newPhotoUrl: string | null | undefined = undefined;
  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN
    });
    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }
  if(id && id === existingResume?.id){
   return await prisma.resume.update({
      where: { id:existingResume?.id },
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
      select: { id: true },
    });
  } else {
   return await prisma.resume.create({
      data: {
        ...resValues,
        photoUrl: newPhotoUrl,
        educations: {
          create: educations?.map((education) => ({
            ...education,
            startDate:education.startDate? new Date(education.startDate):undefined,
            endDate:education.endDate? new Date(education.endDate):undefined
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
      select: { id: true },
    });
  }
};
