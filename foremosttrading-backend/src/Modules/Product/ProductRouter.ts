import { Router } from "express";
import { ProductController } from "./ProductController";

export const ProductRouter = (): Router => {
  const router = Router();
  const controller = new ProductController();

  router.post("/", controller.createProduct);
  router.get("/", controller.getProducts);
  
  router.post("/:id/shapes", controller.addProductShape);
  router.get("/:id/shapes", controller.getProductShapes);

  return router;
};
