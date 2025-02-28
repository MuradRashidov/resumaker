"use server";

import openai from "@/lib/openai";
import { GenerateSummaryInput, generateSummarySchema } from "@/lib/validation";

export const generateSummary = async (input: GenerateSummaryInput) => {
  const { educations, workExperiences, jobTitle, skills } =
    generateSummarySchema.parse(input);
  const systemMessage = `
   Sən bir iş CV generatorusan. Tapşırığın istifadəçinin təqdim etdiyi məlumatlara əsaslanaraq peşəkar bir təqdimat xülasəsi yazmaqdır. 
   Yalnız xülasəni qaytarın və digər heç bir məlumat daxil etməyin. Xülasəni qısa və peşəkar saxlayın.
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

    const completion = await openai.chat.completions.create({
      model:"gpt-3.5-turbo",
        messages: [
            {role:"system", content:systemMessage},
            {role:"user", content:userMessage},
        ],
    })
    const aiResponse = completion.choices[0].message.content;
    if (!aiResponse) {
        throw new Error("Failed to generate summary");
    }
    return aiResponse;
};
