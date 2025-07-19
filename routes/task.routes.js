import { Router } from "express";
import TaskController from '../controllers/task.controller.js';
import { verifyToken } from "../middleware/authMIddleware.js";

const router = Router();
const name="/task";
// Verify token middleware
router.use(verifyToken);
// Route for user registration and list
router.route(name)
    .post(TaskController.addTask)
    .get(TaskController.findTasks);

router.get(`${name}/:taskId`, TaskController.findTaskById);
router.delete(`${name}/:taskId`, TaskController.deleteFile);
router.put(`${name}/:taskId`, TaskController.udpateTask);
router.post(`${name}/comment/:taskId`, TaskController.addComment);
router.post(`${name}/file/:taskId`, TaskController.addFile);

export default router;