import { BaseModule } from "../../core/BaseModule";
import { ProductRouter } from "./ProductRouter";
import { Router } from "express";

export class ProductModule extends BaseModule {
  public readonly name: string = "ProductModule";
  public readonly version: string = "1.0.0";
  public readonly basePath: string = "/admin/products";
  public readonly dependencies?: string[] = [];

  protected async setupUseCases(): Promise<void> {}

  protected async setupControllers(): Promise<void> {}

  protected async setupRoutes(): Promise<void> {
    this.router.use("/", ProductRouter());
  }
}
