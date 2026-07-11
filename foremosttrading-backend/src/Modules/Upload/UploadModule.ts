import { BaseModule } from "../../core/BaseModule";
import { UploadRouter } from "./UploadRouter";
import { Router } from "express";

export class UploadModule extends BaseModule {
  public readonly name = "UploadModule";
  public readonly version = "1.0.0";
  public readonly basePath = "/upload";
  public readonly dependencies = [];

  protected async setupUseCases(): Promise<void> {}
  protected async setupControllers(): Promise<void> {}
  
  protected async setupRoutes(): Promise<void> {
    this.router.use("/admin", UploadRouter()); // e.g. /v1/admin/upload
  }

  // Keeping getRoutes for backwards compatibility if needed elsewhere
  public getRoutes(): Router {
    const router = Router();
    router.use("/admin", UploadRouter()); 
    return router;
  }
}
