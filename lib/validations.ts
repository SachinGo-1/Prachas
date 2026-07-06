import { z } from "zod";
import { SERVICE_INTEREST_OPTIONS, JOB_STATUSES, EMPLOYMENT_TYPES, APPLICATION_STATUSES } from "@/lib/constants";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email address"),
  company: z.string().max(160).optional().or(z.literal("")),
  serviceInterest: z
    .string()
    .refine((v) => SERVICE_INTEREST_OPTIONS.includes(v), "Select a service"),
  message: z.string().min(10, "Please add a few more details").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const applicationSchema = z.object({
  jobId: z.string().min(1, "Missing job reference"),
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number").max(30),
  coverNote: z.string().max(4000).optional().or(z.literal("")),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const jobSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  department: z.string().min(1, "Department is required").max(120),
  location: z.string().min(1, "Location is required").max(160),
  type: z.enum(EMPLOYMENT_TYPES),
  description: z.string().min(10, "Description is required").max(8000),
  requirements: z.string().min(5, "Requirements are required").max(8000),
  salaryRange: z.string().max(120).optional().or(z.literal("")),
  status: z.enum(JOB_STATUSES),
  closingDate: z.string().optional().or(z.literal("")),
});
export type JobInput = z.infer<typeof jobSchema>;

export const applicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

export const inquiryUpdateSchema = z.object({
  isRead: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  role: z.string().min(2, "Role is required").max(120),
  bio: z.string().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().max(500).optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
