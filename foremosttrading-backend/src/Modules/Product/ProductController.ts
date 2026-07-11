import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { ProductService } from "./ProductService";
import { AppLogger } from "../../core/logging/logger";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";

export class ProductController extends BaseController {
  private productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  public createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      
      if (!data.name || !data.slug || !data.category || !data.basePrice) {
        this.sendResponse(req, res, "Missing required fields", HTTPStatusCode.BAD_REQUEST, null);
        return;
      }

      // Convert basePrice to Decimal format string/number expected by Prisma if necessary, 
      // but usually JSON number string is fine.
      
      const product = await this.productService.createProduct(data);
      this.sendCreatedResponse(req, res, { product }, "Product created successfully");
    } catch (error) {
      AppLogger.error("ProductController.createProduct error:", { error });
      this.sendResponse(req, res, "Internal Server Error", HTTPStatusCode.INTERNAL_SERVER_ERROR, null);
    }
  };

  public getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getProducts();
      this.sendResponse(req, res, "Products fetched successfully", HTTPStatusCode.OK, { products });
    } catch (error) {
      AppLogger.error("ProductController.getProducts error:", { error });
      this.sendResponse(req, res, "Internal Server Error", HTTPStatusCode.INTERNAL_SERVER_ERROR, null);
    }
  };

  public addProductShape = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = req.body;
      
      if (!data.name || !data.svgUrl) {
        this.sendResponse(req, res, "Missing required fields: name, svgUrl", HTTPStatusCode.BAD_REQUEST, null);
        return;
      }

      const shape = await this.productService.addProductShape(id, data);
      this.sendCreatedResponse(req, res, { shape }, "Shape added successfully");
    } catch (error) {
      AppLogger.error("ProductController.addProductShape error:", { error });
      this.sendResponse(req, res, "Internal Server Error", HTTPStatusCode.INTERNAL_SERVER_ERROR, null);
    }
  };

  public getProductShapes = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const shapes = await this.productService.getProductShapes(id);
      this.sendResponse(req, res, "Shapes fetched successfully", HTTPStatusCode.OK, { shapes });
    } catch (error) {
      AppLogger.error("ProductController.getProductShapes error:", { error });
      this.sendResponse(req, res, "Internal Server Error", HTTPStatusCode.INTERNAL_SERVER_ERROR, null);
    }
  };
}
