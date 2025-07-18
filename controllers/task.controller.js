import TaskModel from '../models/task.model.js'; // Import the user model
import { mongoose } from '../config/db/connection.js'; // Import mongoose from the connection
import taskModel from '../models/task.model.js';

class TaskController {
    // Create a new task
    async addTask(req, res) {
        try {
            const {
                userId,
                title,
                description,
                type,
                priority,
                color,
                dateStart,
                dateEnd,
                notificationEmail,
                assignees,
                createdBy,
                tags
            } = req.body;

            // Validate required fields
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            // Vailidate required fields
            if (!title || !type || !dateStart || !dateEnd) {
                return res.status(400).json({ error: 'Title, type, start date, and end date are required' });
            }

            // Convert date strings to Date objects
            const startDate = new Date(dateStart);
            const endDate = new Date(dateEnd);
            if (isNaN(startDate) || isNaN(endDate)) {
                return res.status(400).json({ error: 'Invalid date format' });
            }
            if (endDate < startDate) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }

            // Create a new task
            const newTasks = new TaskModel({
                title,
                description,
                type,
                priority,
                color,
                startDate,
                endDate,
                notificationEmail,
                assignees: Array.isArray(assignees)
                    ? assignees.map(assignee => ({
                        name: assignee.name,
                        email: assignee.email,
                        role: assignee.role,
                        userId: assignee.userId // Do not convert to ObjectId here
                    }))
                    : [],
                projectId: req.body.projectId ? new mongoose.Types.ObjectId(req.body.projectId) : null, // Convert to ObjectId if provided
                createdBy: createdBy || userId, // Use userId if createdBy is not provided
                tags: Array.isArray(tags) ? tags.map(tag => tag.name) : []
            });

            const savedTasks = await newTasks.save();
            // Optional: Send notification by email
            if (notificationEmail) {
                // Here you would integrate the emailController
                // emailController.sendNotificationEmail(notificationEmail, savedTasks);
            }
            // Return the saved task as a response
            res.status(201).json({ "data": savedTasks });
        } catch (error) {
            res.status(400).json({
                error: error.message,
                details: error.errors
            });
        }
    }

    async findTasks(req, res){
        try{
            const taskModel = await TaskModel.find();
            return res.status(200).json({
                message: "Tasks retrieved successfully",
                data: taskModel
            })
        }catch(error){
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    async findTaskById(req, res){
        try{
            const taskId = req.params.taskId;
            console.log(taskId);
            if(!taskId || taskId === ":taskId"){
                return res.status(400).json({
                    error: "Required fields are missing"
                });
            };

            const taskFounded = await TaskModel.findOne({taskId});
            if(!taskFounded){
                throw new Error(`Task with ID: ${taskId} not found`);
            }

            return res.status(200).json({
                message: "Task retrieved successfully",
                data: taskFounded
            });
            
        }catch(error){
            if(error.message.includes("not found")){
                return res.status(404).json({
                    error: error.message
                });
            };
            return res.status(500).json({
                error: "Internal server error"
            });
    };
    }
}

export default new TaskController();