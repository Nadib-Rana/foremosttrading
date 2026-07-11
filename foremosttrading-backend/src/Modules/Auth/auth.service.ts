// src/Modules/Auth/AuthServices.ts
import { PrismaClient } from "@/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { ConflictError, NotFoundError, AuthenticationError } from "@/core/errors/AppError";
import bcrypt from "bcrypt";
import Redis from "ioredis";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/utils/jwt";

import { EmailProvider } from "@/providers/EmailProvider";

export class AuthServices {
  // 1. Initialize the contextual logger for this specific service
  private logger = new AppLogger("AuthServices");

  // 2. Use 'private readonly' so TypeScript automatically creates 'this.prisma'
  constructor(
    private readonly prisma: PrismaClient,
    private readonly redis: Redis,
    private readonly email: EmailProvider
  ) {}

  /**
   * Example Use Case: Register a new user
   */
  public async register(
    email: string,
    phone: string,
    fullName: string,
    passwordHash: string,
  ) {
    this.logger.info("Attempting to register user", { email });

    // 3. Business Logic & Database Interaction
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { email },
          { phone }
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        this.logger.warn("Registration failed: User already exists with email", { email });
        throw new ConflictError("A user with this email already exists");
      }
      if (existingUser.phone === phone) {
        this.logger.warn("Registration failed: User already exists with phone", { phone });
        throw new ConflictError("A user with this phone number already exists");
      }
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        phone,
        fullName,
        password: passwordHash, // Make sure to hash passwords before this step!
      },
    });

    this.logger.info("User registered successfully", { userId: newUser.id });

    return newUser;
  }

  public async login(email: string, passwordPlain: string, requireAdmin: boolean = false, sessionId?: string) {
    this.logger.info("Attempting login", { email, requireAdmin });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (user.isDeleted || user.status === "SUSPENDED") {
      throw new AuthenticationError("Account is suspended or deleted");
    }

    if (requireAdmin && user.role !== "ADMIN") {
      throw new AuthenticationError("Admin privileges required");
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Merge cart if sessionId is provided
    if (sessionId) {
      await this.mergeCart(user.id, sessionId);
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in Redis with a 7 day expiration (604800 seconds)
    await this.redis.set(`refresh_token:${user.id}:${refreshToken}`, "valid", "EX", 604800);

    return { user, accessToken, refreshToken };
  }

  private async mergeCart(userId: string, sessionId: string) {
    // 1. Get the guest cart
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true }
    });

    if (!guestCart) return; // No guest cart to merge

    // 2. Get the user cart
    const userCart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!userCart) {
      // 3a. User has no cart, just link the guest cart to the user
      await this.prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId, sessionId: null } // Remove sessionId, attach userId
      });
      return;
    }

    // 3b. User has a cart, merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingUserItem = userCart.items.find(i => i.productId === guestItem.productId);

      if (existingUserItem) {
        // Increase quantity
        await this.prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: { quantity: existingUserItem.quantity + guestItem.quantity }
        });
      } else {
        // Move item to user cart
        await this.prisma.cartItem.update({
          where: { id: guestItem.id },
          data: { cartId: userCart.id }
        });
      }
    }

    // 4. Delete the empty guest cart
    await this.prisma.cart.delete({
      where: { id: guestCart.id }
    });
  }

  public async refresh(refreshToken: string) {
    this.logger.info("Attempting to refresh token");

    const decoded = verifyToken(refreshToken);
    
    // Check if token exists in Redis
    const isValid = await this.redis.get(`refresh_token:${decoded.userId}:${refreshToken}`);
    if (!isValid) {
      throw new AuthenticationError("Refresh token is invalid or expired");
    }

    // Delete old refresh token
    await this.redis.del(`refresh_token:${decoded.userId}:${refreshToken}`);

    // Generate new tokens
    const payload = { userId: decoded.userId, role: decoded.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Store new refresh token in Redis
    await this.redis.set(`refresh_token:${decoded.userId}:${newRefreshToken}`, "valid", "EX", 604800);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  public async requestPasswordReset(identifier: string) {
    this.logger.info("Requesting password reset", { identifier });

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      // Don't leak whether user exists or not, just return silently
      return { success: true, message: "If an account matches, an OTP was sent to the registered email." };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 10 minute expiration
    await this.redis.set(`otp:password_reset:${user.email}`, otp, "EX", 600);

    // Send email
    await this.email.sendOTP(user.email, otp);

    return { success: true, message: "If an account matches, an OTP was sent to the registered email." };
  }

  public async verifyOTP(identifier: string, otp: string) {
    this.logger.info("Verifying OTP for password reset");

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      throw new AuthenticationError("Invalid OTP or identifier");
    }

    const storedOtp = await this.redis.get(`otp:password_reset:${user.email}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new AuthenticationError("Invalid or expired OTP");
    }

    // OTP verified successfully, generate a temporary reset token
    // The reset token is valid for 15 minutes
    const resetToken = generateAccessToken({ userId: user.id, role: user.role }, "15m");
    
    // Optional: Store the reset token in Redis to track usage, but standard JWT works fine too.
    return { success: true, resetToken };
  }

  public async resetPassword(resetToken: string, newPasswordPlain: string) {
    this.logger.info("Resetting password using reset token");

    let decoded;
    try {
      decoded = verifyToken(resetToken);
    } catch (e) {
      throw new AuthenticationError("Invalid or expired reset token");
    }

    const userId = decoded.userId;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash }
    });

    // Clean up OTP from Redis
    await this.redis.del(`otp:password_reset:${user.email}`);

    return { success: true, message: "Password updated successfully" };
  }

  public async getMe(userId: string) {
    this.logger.info("Fetching current user profile", { userId });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
