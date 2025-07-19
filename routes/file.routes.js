import { Router } from "express";
import { fileController } from "../controllers/file.controller.js";
import { verifyToken } from "../middleware/authMIddleware.js";

const router = Router();
const name = "/files";

router.use(verifyToken);

router.route(`${name}/upload`)
  .post(fileController.uploadFile); // Upload file

router.route(`${name}`)
  .get(fileController.getFiles); // Search files

router.route(`${name}/download/:filename`)
  .get(fileController.downloadFile); // Download file

router.route(`${name}/:filename`)
  .get(fileController.getFile) // Get file details by name
  .delete(fileController.deleteFile); // Delete file by name

export default router;