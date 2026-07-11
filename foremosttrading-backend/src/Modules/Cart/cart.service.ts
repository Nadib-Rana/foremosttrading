import { PrismaClient } from "@/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError, BadRequestError } from "@/core/errors/AppError";

export class CartServices {
  private logger = new AppLogger("CartServices");

  constructor(private readonly prisma: PrismaClient) {}

  public async getCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestError("Must provide userId or sessionId");
    }

    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: "asc" }
        },
      },
    });

    return cart;
  }

  public async addItem(
    productId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ) {
    if (!userId && !sessionId) {
      throw new BadRequestError("Must provide userId or sessionId");
    }

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundError("Product");

    // Find or create cart
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
          sessionId,
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(userId, sessionId);
  }

  public async updateItemQuantity(
    itemId: string,
    quantity: number,
    userId?: string,
    sessionId?: string
  ) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) throw new NotFoundError("Cart Item");

    // Verify ownership
    if (
      (userId && item.cart.userId !== userId) ||
      (!userId && sessionId && item.cart.sessionId !== sessionId)
    ) {
      throw new NotFoundError("Cart Item"); // Hide true existence for security
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId, sessionId);
  }

  public async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item) throw new NotFoundError("Cart Item");

    // Verify ownership
    if (
      (userId && item.cart.userId !== userId) ||
      (!userId && sessionId && item.cart.sessionId !== sessionId)
    ) {
      throw new NotFoundError("Cart Item");
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId, sessionId);
  }
  public async clearCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestError("Must provide userId or sessionId");
    }

    const cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(userId, sessionId);
  }
}
