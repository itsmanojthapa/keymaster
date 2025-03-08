import { z, object } from "zod";

export const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(6, "Password must be more than 6 characters")
  .max(16, "Password must be less than 16 characters");

export const emailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .min(1, "Email is required")
  .email("Invalid email")
  .refine((email) => !email.includes(" "), {
    message: "Email cannot contain spaces",
  });

export const nameSchema = z
  .string({ required_error: "Name is required" })
  .min(3, "Name must be more than 3 characters")
  .max(15, "Name must be less than 15 characters");

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmpass: passwordSchema,
}).superRefine(({ password, confirmpass }, ctx) => {
  if (password !== confirmpass) {
    ctx.addIssue({
      path: ["confirmpass"],
      message: "Passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
});

export const forgetPasswordSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export const changePasswordSchema = object({
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
  if (newPassword !== confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
});
