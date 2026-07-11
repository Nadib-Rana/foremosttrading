import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { CartServices } from "./cart.service";
import { CartController } from "./cart.controller";
import { validateRequest } from "@/middleware/validation";
import { addItemSchema, updateItemSchema } from "./CartDTO";
import { optionalAuthMiddleware } from "@/middleware/auth";

export class CartModule extends BaseModule {
  public name: string = "CartModule";
  public version: string = "1.0.0";
  public basePath: string = "/cart";
  public dependencies?: string[] = [];
  
  private logger = new AppLogger("CartModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("CartService", new CartServices(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const cartService = this.getService<CartServices>("CartService");
    this.registerController("CartController", new CartController(cartService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<CartController>("CartController");
    
    // GET /cart/v1/
    this.router.get(
      "/",
      optionalAuthMiddleware,
      controller.getCart.bind(controller)
    );

    // POST /cart/v1/items
    this.router.post(
      "/items",
      optionalAuthMiddleware,
      validateRequest(addItemSchema),
      controller.addItem.bind(controller)
    );

    // PUT /cart/v1/items/:id
    this.router.put(
      "/items/:id",
      optionalAuthMiddleware,
      validateRequest(updateItemSchema),
      controller.updateItem.bind(controller)
    );

    // DELETE /cart/v1/items/:id
    this.router.delete(
      "/items/:id",
      optionalAuthMiddleware,
      controller.removeItem.bind(controller)
    );

    // DELETE /cart/v1/
    this.router.delete(
      "/",
      optionalAuthMiddleware,
      controller.clearCart.bind(controller)
    );
  }
}
