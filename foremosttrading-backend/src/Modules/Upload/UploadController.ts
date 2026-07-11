import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { UploadService } from "./UploadService";
import { AppLogger } from "../../core/logging/logger";
import { HTTPStatusCode } from "../../types/HTTPStatusCode";

export class UploadController extends BaseController {
  private uploadService: UploadService;

  constructor() {
    super();
    this.uploadService = new UploadService();
  }

  public uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        this.sendResponse(req, res, "No file uploaded", HTTPStatusCode.BAD_REQUEST, null);
        return;
      }

      const fileUrl = await this.uploadService.uploadFile(req.file);

      this.sendCreatedResponse(req, res, { url: fileUrl }, "File uploaded successfully");
    } catch (error) {
      AppLogger.error("UploadController.uploadFile error:", { error });
      this.sendResponse(req, res, "Internal Server Error", HTTPStatusCode.INTERNAL_SERVER_ERROR, undefined);
    }
  };
}
