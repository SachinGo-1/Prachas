import { z } from "zod";
import {
  SERVICE_INTEREST_OPTIONS,
  JOB_STATUSES,
  EMPLOYMENT_TYPES,
  APPLICATION_STATUSES,
  BLOG_CATEGORIES,
  JOB_DEPARTMENTS,
} from "@/lib/constants";

const optionalString = (max: number) =>
  z.string().max(max).optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email address"),
  company: optionalString(160),
  phone: optionalString(30),
  serviceInterest: z
    .string()
    .refine((v) => SERVICE_INTEREST_OPTIONS.includes(v), "Select a service"),
  message: z.string().min(10, "Please add a few more details").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Application — used by both the Jobs apply modal (jobId set) and the
 * Join Us general form (jobId empty). The resume is uploaded first, then
 * its URL is submitted here.
 */
export const applicationSchema = z.object({
  jobId: optionalString(60),
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number").max(30),
  department: optionalString(120),
  // Set server-side after the uploaded PDF is written to disk; the route
  // validates the actual file part separately.
  resumeUrl: optionalString(500),
  coverNote: optionalString(4000),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const jobSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  department: z.enum(JOB_DEPARTMENTS),
  location: z.string().min(1, "Location is required").max(160),
  type: z.enum(EMPLOYMENT_TYPES),
  description: z.string().min(10, "Description is required").max(12000),
  requirements: z.string().min(5, "Requirements are required").max(12000),
  salaryRange: optionalString(120),
  status: z.enum(JOB_STATUSES),
  closingDate: z.string().optional().or(z.literal("")),
});
export type JobInput = z.infer<typeof jobSchema>;

export const blogSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  category: z.enum(BLOG_CATEGORIES),
  excerpt: z.string().min(10, "Excerpt is required").max(300),
  body: z.string().min(10, "Body is required").max(50000),
  coverImage: optionalString(500),
  author: z.string().min(2, "Author is required").max(120),
  tags: optionalString(400),
  status: z.enum(["draft", "published"]),
});
export type BlogInput = z.infer<typeof blogSchema>;

export const serviceSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  shortDesc: z.string().min(2, "Short description is required").max(400),
  longDesc: z.string().min(2, "Long description is required").max(20000),
  benefits: z.array(z.string().max(300)).max(12),
  industries: z.array(z.string().max(60)).max(20),
  displayOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

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
  bio: optionalString(2000),
  photoUrl: optionalString(500),
  displayOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
