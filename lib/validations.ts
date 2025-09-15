import { z } from "zod";
import {
  NigerianStates,
  PropertyListingTypes,
  PropertyStatus,
  PropertySubType,
  PropertyType,
  UserRole,
} from "./enums";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[\d\s\-$$$$]+$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(Object.values(UserRole) as [string, ...string[]], {
      required_error: "Please select a role",
    }),

    // role: z.enum(["user", "agent"], {
    //   required_error: "Please select a role",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const addPropertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  address: z.string().min(3, "Location must be at least 3 characters"),
  state: z.enum(Object.values(NigerianStates) as [string, ...string[]], {
    required_error: "Please select a State",
  }),
  listing_type: z.enum(
    Object.values(PropertyListingTypes) as [string, ...string[]],
    {
      required_error: "Please select a Listing Type",
    }
  ),
  status: z
    .enum(Object.values(PropertyStatus) as [string, ...string[]], {
      required_error: "Please select the property status",
    })
    .default(PropertyStatus.AVAILABLE),

  images: z.any().optional(),
  videos: z.any().optional(),
  propertyType: z.enum(Object.values(PropertyType) as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a property type" }),
  }),
  propertySubType: z
    .string()
    .nonempty("Please select a property subtype")
    .refine((val) => Object.values(PropertySubType).includes(val as any), {
      message: "Invalid subtype selected",
    }),
  bedrooms: z.coerce.number().min(0, "Bedrooms must be 0 or more"),
  baths: z.coerce.number().min(0, "Baths must be 0 or more"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddPropertyFormData = z.infer<typeof addPropertySchema>;
