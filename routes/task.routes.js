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

export default router;