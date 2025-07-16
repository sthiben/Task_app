import { Router } from "express";
import UserController from '../controllers/user.controller.js';
import { verifyToken } from "../middleware/authMIddleware.js";

const router = Router();

// Public route
router.post('/user', verifyToken, UserController.addUser);
router.get('/user', verifyToken, UserController.show);



export default router;