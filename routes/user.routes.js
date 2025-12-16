import { Router } from "express";
import UserController from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// User routes (own profile)
router.get('/user/:userId', verifyToken, UserController.showById);
router.put('/user/:userId', verifyToken, UserController.update);

// Admin only routes
router.post('/user', verifyToken, verifyAdmin, UserController.addUser);
router.get('/user', verifyToken, verifyAdmin, UserController.show);
router.delete('/user/:userId', verifyToken, verifyAdmin, UserController.delete);

// Aggregation routes (admin only)
router.get('/user/stats/by-membership', verifyToken, verifyAdmin, UserController.getUsersByMembership);
router.get('/user/stats/by-role', verifyToken, verifyAdmin, UserController.getUsersByRole);
router.get('/user/stats/dashboard', verifyToken, verifyAdmin, UserController.getUserStats);

export default router;