import UserModel from '../models/user.model.js'; //Import the UserModel
import dotenv from 'dotenv';

dotenv.config();
class UserController {
    // User registration
    async addUser(req, res) {
        const passwordRegex = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/;
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'All data is mandatory for entry' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).json({ error: 'The password must be between 8 and 16 characters long, with at least one digit, at least one lowercase letter, at least one uppercase letter, and at least one non-alphanumeric character.' });
            }

            const existingUserModel = await UserModel.findOne({ email });
            if (existingUserModel) {
                return res.status(400).json({ error: 'The user already exists' });
            }

            const newUserModel = new UserModel({ username, email, password });
            await newUserModel.save();
            return res.status(201).json({ message: 'User successfully registered' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    // Users list
    async show(req, res) {
        try {
            const userModel = await UserModel.find();
            if (!userModel) throw new Error('User not found');
            return res.status(200).json({ data: userModel });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };
    async showById(req, res) {
        try {
            const userId = req.params.userId;
            const userModel = await UserModel.findById(userId).select('-password');
            if (!userModel) throw new Error('User not found');
            return res.status(200).json(userModel);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };
    async delete(req, res) {
        try {
            const deletedUser = await UserModel.findOneAndDelete({
                _id: req.params.id
            });
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not updated' });
            }
            res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    }


    async update(req, res) {
        try {
            const userId = req.params.userId;
            const { username, email, phone, membershipType } = req.body;
            
            const updateData = {};
            if (username) updateData.username = username;
            if (email) updateData.email = email;
            if (phone !== undefined) updateData.phone = phone;
            if (membershipType) updateData.membershipType = membershipType;
            
            const userModel = await UserModel.findByIdAndUpdate(
                userId, 
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!userModel) throw new Error('User not found');
            return res.status(200).json(userModel);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // AGGREGATIONS

    // Get users by membership type
    async getUsersByMembership(req, res) {
        try {
            const stats = await UserModel.aggregate([
                {
                    $group: {
                        _id: '$membershipType',
                        count: { $sum: 1 },
                        activeUsers: {
                            $sum: { $cond: ['$isActive', 1, 0] }
                        }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);
            res.status(200).json(stats);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Get users by role
    async getUsersByRole(req, res) {
        try {
            const stats = await UserModel.aggregate([
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                }
            ]);
            res.status(200).json(stats);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Get user statistics
    async getUserStats(req, res) {
        try {
            const stats = await UserModel.aggregate([
                {
                    $facet: {
                        totalUsers: [
                            { $count: 'count' }
                        ],
                        activeUsers: [
                            { $match: { isActive: true } },
                            { $count: 'count' }
                        ],
                        byMembership: [
                            {
                                $group: {
                                    _id: '$membershipType',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        byRole: [
                            {
                                $group: {
                                    _id: '$role',
                                    count: { $sum: 1 }
                                }
                            }
                        ]
                    }
                }
            ]);
            res.status(200).json(stats[0]);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

};


export default new UserController();