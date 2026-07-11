// src/Modules/Auth/AuthDTO.ts
import { z } from "zod";

export const createUserSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full name is too short"),
    phone: z.string().min(10, "Phone number is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // You can make optional fields available too based on your Prisma schema
    username: z.string().optional(),
  }),
};

// Extract the inferred TypeScript type for the validated body
export type CreateUserDTO = z.infer<typeof createUserSchema.body>;

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
};
export type LoginDTO = z.infer<typeof loginSchema.body>;

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
};
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema.body>;

export const requestPasswordResetSchema = {
  body: z.object({
    identifier: z.string().min(1, "Email or phone is required"),
  }),
};
export type RequestPasswordResetDTO = z.infer<typeof requestPasswordResetSchema.body>;

export const verifyOtpSchema = {
  body: z.object({
    identifier: z.string().min(1, "Email or phone is required"),
    otp: z.string().length(6, "OTP must be exactly 6 characters"),
  }),
};
export type VerifyOtpDTO = z.infer<typeof verifyOtpSchema.body>;

export const resetPasswordSchema = {
  body: z.object({
    resetToken: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  }),
};
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema.body>;
