import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { CartServices } from "./cart.service";
import { AddItemDTO, UpdateItemDTO } from "./CartDTO";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";

export class CartController extends BaseController {
  constructor(private readonly cartService: CartServices) {
    super();
  }

  private getIdentifiers(req: Request) {
    const userId = (req as any).user?.id; // Assuming authentication middleware sets req.user
    const rawSessionId = req.headers["x-session-id"];
    const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
    return { userId, sessionId };
  }

  public async getCart(req: Request, res: Response) {
    const { userId, sessionId } = this.getIdentifiers(req);
    const cart = await this.cartService.getCart(userId, sessionId);
    return this.sendResponse(req, res, "Cart retrieved", HTTPStatusCode.OK, cart || { items: [] });
  }

  public async addItem(req: Request, res: Response) {
    const { userId, sessionId } = this.getIdentifiers(req);
    const { productId, quantity } = req.validatedBody as AddItemDTO;

    const cart = await this.cartService.addItem(productId, quantity, userId, sessionId);
    return this.sendResponse(req, res, "Item added to cart", HTTPStatusCode.CREATED, cart);
  }

  public async updateItem(req: Request, res: Response) {
    const { userId, sessionId } = this.getIdentifiers(req);
    const { quantity } = req.validatedBody as UpdateItemDTO;
    const itemId = req.params.id as string;

    const cart = await this.cartService.updateItemQuantity(itemId, quantity, userId, sessionId);
    return this.sendResponse(req, res, "Cart updated", HTTPStatusCode.OK, cart);
  }

  public async removeItem(req: Request, res: Response) {
    const { userId, sessionId } = this.getIdentifiers(req);
    const itemId = req.params.id as string;

    const cart = await this.cartService.removeItem(itemId, userId, sessionId);
    return this.sendResponse(req, res, "Item removed from cart", HTTPStatusCode.OK, cart);
  }
  public async clearCart(req: Request, res: Response) {
    const { userId, sessionId } = this.getIdentifiers(req);
    const cart = await this.cartService.clearCart(userId, sessionId);
    return this.sendResponse(req, res, "Cart cleared", HTTPStatusCode.OK, cart);
  }
}
