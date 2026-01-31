import { z } from "zod";

export const profileSchema = z.object({
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  hlaMarkers: z.string().optional(),
  urgencyScore: z.number().min(1).max(10).optional(),
  location: z.string().min(2),
  age: z.number().min(18).max(100),
  comorbidities: z.string().optional(),
  role: z.enum(["donor", "recipient"]),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
