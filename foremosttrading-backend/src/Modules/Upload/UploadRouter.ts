import { Router } from "express";
import multer from "multer";
import { UploadController } from "./UploadController";

const upload = multer({ storage: multer.memoryStorage() });

export const UploadRouter = (): Router => {
  const router = Router();
  const controller = new UploadController();

  router.post("/upload", upload.single("file"), controller.uploadFile);

  return router;
};
