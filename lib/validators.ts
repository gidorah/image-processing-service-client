import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password1: z.string().min(6),
    password2: z.string().min(6),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
