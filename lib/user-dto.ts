import { z } from "zod";
import { InquiryStages, UserRole } from "./enums";

export const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"), // adjust as needed
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
  agency_name: z.string().optional(),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateInquirySchema = z.object({
  inquiry_id: z.string().min(1, "Inquiry ID is required"),
  inquiry_state: z.enum(Object.values(InquiryStages) as [string, ...string[]]),
});
export type updateInquiryDto = z.infer<typeof updateInquirySchema>;

export const documentUpdateDto = {
  userId: String,
  fileName: String,
};
export const inquirySchema = z.object({
  property_id: z.string().min(1, "No property specified"),
  message: z.string().optional(),
});
export type InquiryDto = z.infer<typeof inquirySchema>;
