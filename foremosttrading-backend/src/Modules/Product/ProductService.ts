import { prisma } from "../../lib/prisma";
import { Prisma } from "@/generated/client";

export class ProductService {
  public async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
    });
  }

  public async getProducts() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        shapes: true,
      }
    });
  }

  public async addProductShape(productId: string, data: Prisma.ProductShapeCreateInput) {
    return prisma.productShape.create({
      data: {
        ...data,
        product: {
          connect: { id: productId }
        }
      }
    });
  }

  public async getProductShapes(productId: string) {
    return prisma.productShape.findMany({
      where: { productId }
    });
  }
}
