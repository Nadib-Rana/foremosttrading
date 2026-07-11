import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { AuthServices } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateRequest } from "@/middleware/validation";
import { authMiddleware } from "@/middleware/auth";
import { 
  createUserSchema, 
  loginSchema, 
  refreshTokenSchema,
  requestPasswordResetSchema,
  verifyOtpSchema,
  resetPasswordSchema
} from "./AuthDTO";

export class AuthModule extends BaseModule {
  public name: string = "AuthModule";
  public version: string = "1.0.0";
  public basePath: string = "/auth/v1/";
  public dependencies?: string[] | undefined;

  private logger = new AppLogger("AuthModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    const redis = this.context.getService("redis");
    const email = this.context.getService("email");
    this.registerService("AuthService", new AuthServices(prisma, redis, email));
  }
  protected async setupControllers(): Promise<void> {
    const authService = this.getService<AuthServices>("AuthService");
    this.registerController("AuthController", new AuthController(authService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<AuthController>("AuthController");
    // POST /auth/v1/register
    this.router.post(
      "/register",
      validateRequest(createUserSchema), // 1. Intercepts & validates request
      controller.createUser.bind(controller),
    );

    // POST /auth/v1/login
    this.router.post(
      "/login",
      validateRequest(loginSchema),
      controller.loginUser.bind(controller),
    );

    // POST /auth/v1/admin/login
    this.router.post(
      "/admin/login",
      validateRequest(loginSchema),
      controller.loginAdmin.bind(controller),
    );

    // POST /auth/v1/refresh
    this.router.post(
      "/refresh",
      validateRequest(refreshTokenSchema),
      controller.refreshToken.bind(controller),
    );
    // POST /auth/v1/password/reset-request
    this.router.post(
      "/password/reset-request",
      validateRequest(requestPasswordResetSchema),
      controller.requestPasswordReset.bind(controller)
    );

    // POST /auth/v1/password/verify-otp
    this.router.post(
      "/password/verify-otp",
      validateRequest(verifyOtpSchema),
      controller.verifyOTP.bind(controller)
    );

    // POST /auth/v1/password/reset
    this.router.post(
      "/password/reset",
      validateRequest(resetPasswordSchema),
      controller.resetPassword.bind(controller)
    );

    // GET /auth/v1/me
    this.router.get(
      "/me",
      authMiddleware,
      controller.getMe.bind(controller)
    );
  }
}
