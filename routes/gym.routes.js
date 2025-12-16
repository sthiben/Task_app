import { Router } from 'express';
import GymController from '../controllers/gym.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (no authentication required)
router.get('/gym', GymController.getClasses);
router.get('/gym/:id', GymController.getClassById);

// Aggregation routes (admin only)
router.get('/gym/stats/by-type', verifyToken, verifyAdmin, GymController.getStatsByType);
router.get('/gym/stats/popular', verifyToken, verifyAdmin, GymController.getMostPopularClasses);
router.get('/gym/stats/by-status', verifyToken, verifyAdmin, GymController.getClassesByStatus);
router.get('/gym/stats/dashboard', verifyToken, verifyAdmin, GymController.getDashboardStats);

// Admin only routes
router.post('/gym', verifyToken, verifyAdmin, GymController.createClass);
router.put('/gym/:id', verifyToken, verifyAdmin, GymController.updateClass);
router.delete('/gym/:id', verifyToken, verifyAdmin, GymController.deleteClass);

// User routes (authentication required)
router.post('/gym/:id/enroll', verifyToken, GymController.enrollUser);

export default router;
