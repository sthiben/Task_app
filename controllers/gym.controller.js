import Class from '../models/class.model.js';

const GymController = {
    // Get all classes
    async getClasses(req, res) {
        try {
            const classes = await Class.find().sort({ createdAt: -1 });
            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching classes', error: error.message });
        }
    },

    // Get class by ID
    async getClassById(req, res) {
        try {
            const classData = await Class.findById(req.params.id);
            if (!classData) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json(classData);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching class', error: error.message });
        }
    },

    // Create new class
    async createClass(req, res) {
        try {
            // Get user ID from verified token
            const userId = req.user.id;
            
            const classData = {
                ...req.body,
                userId: userId,
                createdBy: userId
            };
            
            const newClass = new Class(classData);
            const savedClass = await newClass.save();
            res.status(201).json(savedClass);
        } catch (error) {
            console.error('Error creating class:', error);
            res.status(400).json({ 
                message: error.message || 'Error creating class',
                details: error.errors ? Object.keys(error.errors).map(key => ({
                    field: key,
                    message: error.errors[key].message
                })) : []
            });
        }
    },

    // Update class
    async updateClass(req, res) {
        try {
            const updatedClass = await Class.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedClass) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json(updatedClass);
        } catch (error) {
            res.status(400).json({ message: 'Error updating class', error: error.message });
        }
    },

    // Delete class
    async deleteClass(req, res) {
        try {
            const deletedClass = await Class.findByIdAndDelete(req.params.id);
            if (!deletedClass) {
                return res.status(404).json({ message: 'Class not found' });
            }
            res.status(200).json({ message: 'Class deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting class', error: error.message });
        }
    },

    // Enroll user in class
    async enrollUser(req, res) {
        try {
            const { userId } = req.body;
            const classData = await Class.findById(req.params.id);
            
            if (!classData) {
                return res.status(404).json({ message: 'Class not found' });
            }

            if (classData.enrolledUsers.includes(userId)) {
                return res.status(400).json({ message: 'User already enrolled' });
            }

            if (classData.enrolledUsers.length >= classData.maxCapacity) {
                return res.status(400).json({ message: 'Class is full' });
            }

            classData.enrolledUsers.push(userId);
            await classData.save();

            res.status(200).json(classData);
        } catch (error) {
            res.status(500).json({ message: 'Error enrolling user', error: error.message });
        }
    },

    // AGGREGATIONS

    // Get statistics by class type
    async getStatsByType(req, res) {
        try {
            const stats = await Class.aggregate([
                {
                    $group: {
                        _id: '$type',
                        totalClasses: { $sum: 1 },
                        avgCapacity: { $avg: '$maxCapacity' },
                        totalEnrolled: { $sum: { $size: '$enrolledUsers' } }
                    }
                },
                {
                    $sort: { totalClasses: -1 }
                }
            ]);
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching stats', error: error.message });
        }
    },

    // Get most popular classes (by enrollment)
    async getMostPopularClasses(req, res) {
        try {
            const popularClasses = await Class.aggregate([
                {
                    $addFields: {
                        enrollmentCount: { $size: '$enrolledUsers' }
                    }
                },
                {
                    $sort: { enrollmentCount: -1 }
                },
                {
                    $limit: 10
                },
                {
                    $project: {
                        title: 1,
                        type: 1,
                        instructor: 1,
                        enrollmentCount: 1,
                        maxCapacity: 1,
                        occupancyRate: {
                            $multiply: [
                                { $divide: ['$enrollmentCount', '$maxCapacity'] },
                                100
                            ]
                        }
                    }
                }
            ]);
            res.status(200).json(popularClasses);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching popular classes', error: error.message });
        }
    },

    // Get classes by status
    async getClassesByStatus(req, res) {
        try {
            const statusStats = await Class.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        classes: {
                            $push: {
                                title: '$title',
                                type: '$type',
                                startDate: '$startDate'
                            }
                        }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);
            res.status(200).json(statusStats);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching status stats', error: error.message });
        }
    },

    // Get dashboard statistics
    async getDashboardStats(req, res) {
        try {
            const stats = await Class.aggregate([
                {
                    $facet: {
                        totalClasses: [
                            { $count: 'count' }
                        ],
                        byType: [
                            {
                                $group: {
                                    _id: '$type',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        byStatus: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        avgEnrollment: [
                            {
                                $group: {
                                    _id: null,
                                    avgEnrolled: { $avg: { $size: '$enrolledUsers' } },
                                    avgCapacity: { $avg: '$maxCapacity' }
                                }
                            }
                        ],
                        upcomingClasses: [
                            {
                                $match: {
                                    startDate: { $gte: new Date() },
                                    status: 'Programada'
                                }
                            },
                            { $count: 'count' }
                        ]
                    }
                }
            ]);
            res.status(200).json(stats[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
        }
    }
};

export default GymController;
