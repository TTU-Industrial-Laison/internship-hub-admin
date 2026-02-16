import { MultiSelectOption } from "@/types/api/internship-period";

export const INTERNSHIP_STATUS_OPTIONS = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
];

export const eligibleCategories = ["MTECH", "BTECH", "BTECH_TOPUP", "HND", "DIPLOMA"];

export const CATEGORY_OPTIONS: MultiSelectOption[] = [
  { label: "MTECH", value: "MTECH" },
  { label: "BTECH", value: "BTECH" },
  { label: "BTECH TOPUP", value: "BTECH_TOPUP" },
  { label: "HND", value: "HND" },
  { label: "DIPLOMA", value: "DIPLOMA" },
];
