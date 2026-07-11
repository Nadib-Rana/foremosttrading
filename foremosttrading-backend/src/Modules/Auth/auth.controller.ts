// src/Modules/Auth/AuthController.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateUserDTO } from "./AuthDTO";
import { AuthServices } from "./auth.service";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";

export class AuthController extends BaseController {
  // Initialize the contextual logger
  private logger = new AppLogger("AuthController");

  // Inject the service via the constructor
  constructor(private readonly authService: AuthServices) {
    super();
  }

  /**
   * Endpoint: POST /auth/v1/users
   */
  public async createUser(req: Request, res: Response) {
    this.logger.info("Received request to create a new user");

    // 1. Extract the validated body (populated by your validateRequest middleware)
    const { email, phone, fullName, password } =
      req.validatedBody as CreateUserDTO;

    // 2. Pass the data to the Service Layer (Business Logic)
    const newUser = await this.authService.register(
      email,
      phone,
      fullName,
      password,
    );

    // 3. Remove sensitive information before sending it back to the client
    // (Alternatively, you can use Prisma's `omit` feature if you configure it)
    const { password: _, ...userWithoutPassword } = newUser;

    // 4. Send the standardized response using BaseController's built-in method
    return this.sendCreatedResponse(
      req,
      res,
      userWithoutPassword,
      "User registered successfully",
    );
  }

  public async loginUser(req: Request, res: Response) {
    this.logger.info("Received request for user login");
    const { email, password } = req.validatedBody as any;

    const sessionId = req.headers["x-session-id"] as string | undefined;
    const { user, accessToken, refreshToken } = await this.authService.login(email, password, false, sessionId);
    const { password: _, ...userWithoutPassword } = user;

    return this.sendResponse(req, res, "Login successful", HTTPStatusCode.OK, { user: userWithoutPassword, accessToken, refreshToken });
  }

  public async loginAdmin(req: Request, res: Response) {
    this.logger.info("Received request for admin login");
    const { email, password } = req.validatedBody as any;

    const { user, accessToken, refreshToken } = await this.authService.login(email, password, true);
    const { password: _, ...userWithoutPassword } = user;

    return this.sendResponse(req, res, "Admin login successful", HTTPStatusCode.OK, { user: userWithoutPassword, accessToken, refreshToken });
  }

  public async refreshToken(req: Request, res: Response) {
    this.logger.info("Received request to refresh token");
    const { refreshToken } = req.validatedBody as any;

    const tokens = await this.authService.refresh(refreshToken);
    return this.sendResponse(req, res, "Token refreshed successfully", HTTPStatusCode.OK, tokens);
  }

  public async requestPasswordReset(req: Request, res: Response) {
    this.logger.info("Received request for password reset");
    const { identifier } = req.validatedBody as any;

    const result = await this.authService.requestPasswordReset(identifier);
    return this.sendResponse(req, res, "Request processed", HTTPStatusCode.OK, result);
  }

  public async verifyOTP(req: Request, res: Response) {
    this.logger.info("Received request to verify OTP");
    const { identifier, otp } = req.validatedBody as any;

    const result = await this.authService.verifyOTP(identifier, otp);
    return this.sendResponse(req, res, "OTP verified", HTTPStatusCode.OK, result);
  }

  public async resetPassword(req: Request, res: Response) {
    this.logger.info("Received request to reset password");
    const { resetToken, newPassword } = req.validatedBody as any;

    const result = await this.authService.resetPassword(resetToken, newPassword);
    return this.sendResponse(req, res, "Password reset successful", HTTPStatusCode.OK, result);
  }

  public async getMe(req: Request, res: Response) {
    this.logger.info("Received request for user profile");
    const userId = (req as any).user?.userId; // Assumes authMiddleware sets req.user

    if (!userId) {
      return this.sendResponse(req, res, "Unauthorized", HTTPStatusCode.UNAUTHORIZED, null);
    }

    const user = await this.authService.getMe(userId);
    return this.sendResponse(req, res, "User profile retrieved", HTTPStatusCode.OK, user);
  }
}
