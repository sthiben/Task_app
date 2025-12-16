import UserModel from '../models/user.model.js'; // Import the user model
import jwt from 'jsonwebtoken';
import { encryptPassword, comparePassword } from '../library/appBCrypt.js';

import dotenv from 'dotenv';
dotenv.config();

class AuthController {
  // User registration
  async register(req, res) {
    try {
      const { username, email, password, phone, membershipType } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }

      const existingUserModel = await UserModel.findOne({ email });
      if (existingUserModel) {
        return res.status(400).json({ error: 'El miembro ya existe' });
      }

      const newUserModel = new UserModel({ 
        username, 
        email, 
        password,
        phone,
        membershipType: membershipType || 'Básica'
      });
      newUserModel.password = await encryptPassword(newUserModel.password);
      await newUserModel.save();

      return res.status(201).json({ message: 'Miembro registrado exitosamente' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userModel = await UserModel.findOne({ email });
      if (!userModel) throw new Error('Miembro no encontrado');

      const isMatch = await comparePassword(password, userModel.password);
      if (!isMatch) throw new Error('Contraseña incorrecta');

      const token = jwt.sign({ id: userModel._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      
      // Return user data without password
      const userData = {
        _id: userModel._id,
        username: userModel.username,
        email: userModel.email,
        phone: userModel.phone,
        role: userModel.role,
        membershipType: userModel.membershipType
      };
      
      res.status(200).json({ 
        message: 'Inicio de sesión exitoso', 
        token: token,
        user: userData
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

}

export default new AuthController();