import z from "zod";

export const zoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  transparency: z.number().min(0).max(1),
  borderWidth: z.number().min(1).max(10),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;
