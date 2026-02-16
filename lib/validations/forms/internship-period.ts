import { eligibleCategories } from "@/lib/constants/internship-period";
import { z } from "zod";

export const internshipPeriodInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "This field is required")
      .refine(
        (val) => val.replace(/[^A-Za-z0-9]/g, "").length >= 3,
        "Name must contain at least 3 letters"
      ),

    startDate: z.date().optional(),

    endDate: z.date().optional(),

    eligibleCategories: z
      .array(z.enum(eligibleCategories))
      .min(1, "Select at least one category"),

    status: z.enum(["ONGOING", "COMPLETED"]),
  })
  .refine((data) => data.startDate instanceof Date, {
    message: "Start date is required",
    path: ["startDate"],
  })
  .refine((data) => data.endDate instanceof Date, {
    message: "End date is required",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

// Output schema (transforms Date objects to ISO strings)
export const internshipPeriodSchema = internshipPeriodInputSchema
  .refine(
    (data) => data.startDate instanceof Date && data.endDate instanceof Date,
    {
      message: "Both dates are required",
    }
  )
  .transform((data) => ({
    ...data,
    startDate: data.startDate!.toISOString(),
    endDate: data.endDate!.toISOString(),
  }));

export type InternshipPeriodValues = z.infer<typeof internshipPeriodSchema>;
export type InternshipPeriodInputValues = z.infer<
  typeof internshipPeriodInputSchema
>;
