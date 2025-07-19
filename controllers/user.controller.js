import { encryptPassword } from '../library/appBCrypt.js';
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
            return res.status(400).json({ error: err.message });
        }
    }
    // Users list
    async show(req, res) {
        try {
            const userModel = await UserModel.find();
            if (!userModel) throw new Error('User not found');
            return res.status(200).json({ data: userModel });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    };

    // Get user by id
    async showById(req, res) {
        try {
            const userId = req.params.userId;
            const userModel = await UserModel.findById(userId);
            if (!userModel) throw new Error(`User with ID: ${userId} not found`);
            return res.status(200).json({ data: userModel });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    };

    // Delete an user
    async delete(req, res) {
        try {
            const userId = req.params.userId;
            if(!userId || userId === ":userId"){
                return res.status(400).json({
                    error: "Missing required fields"
                });
            };
            const userModel = await UserModel.findByIdAndDelete(userId);
            if (!userModel) throw new Error(`User not found`);
            return res.status(200).json({ message: `User deleted successfully` });
        } catch (err) {
            if(err.message === "User not found"){
                return res.status(404).json({
                    error: `User not found`
                });
            }
            return res.status(400).json({ error: err.message });
        }
    };

    // Update an user
    async update(req, res) {
        try {
            const userId = req.params.userId;
            const { username, email, password } = req.body;

            if(!username || !email || !password){
                return res.status(400).json({
                    error: "Missing required fields"
                });
            };

            const userFounded = await UserModel.findById(userId);
            
            if(!userFounded){
                throw new Error(`User with ID: ${userId} not found`);
            };
                    
            const userModel = await UserModel.findOneAndUpdate(
                {_id: userId}, 
                {username, email, password},
                {
                    new: true,
                    runValidators: true,
                    upsert: false
                }
            );

            return res.status(200).json({ message: `User updated successfully`, data:userModel });
        } catch (err) {
            if(err.message.includes("User with ID:")){
                return res.status(404).json({
                    error: err.message
                });
            }
            return res.status(400).json({ error: err.message });
        }
    };

};


export default new UserController();