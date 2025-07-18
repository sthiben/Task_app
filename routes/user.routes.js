import { Router } from "express";
import UserController from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/authMIddleware.js";

const router = Router();

// Public route
router.post('/user', verifyToken, UserController.addUser);
router.get('/user', verifyToken, UserController.show);
router.get('/user/:userId', verifyToken, UserController.showById);
router.delete('/user/:userId', verifyToken, UserController.delete);
router.put('/user/:userId', verifyToken, UserController.update);
export default router;