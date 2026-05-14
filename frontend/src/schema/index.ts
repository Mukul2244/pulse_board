import z from "zod";

export const optionSchema = z.object({
  text: z.string().min(1, "Option text cannot be empty"),
});

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  mandatory: z.boolean(),
  options: z
    .array(optionSchema)
    .min(2, "Each question needs at least 2 options"),
});

export const pollSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be under 255 characters"),
  description: z.string().optional(),
  isAnonymous: z.boolean(),
  expiresAt: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

export type PollFormValues = z.infer<typeof pollSchema>;