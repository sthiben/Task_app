import { connectDB, mongoose } from '../config/db/connection.js';
import UserModel from '../models/user.model.js';
import { encryptPassword } from '../library/appBCrypt.js';

const createAdmin = async () => {
    try {
        await connectDB();
        
        // Check if admin already exists
        const existingAdmin = await UserModel.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('WARNING: Admin user already exists:', existingAdmin.email);
            await mongoose.connection.close();
            process.exit(0);
        }
        
        // Create admin user
        const adminData = {
            username: 'admin',
            email: 'admin@gymmanager.com',
            password: await encryptPassword('Admin123!'),
            phone: '+1234567890',
            role: 'admin',
            membershipType: 'VIP',
            isActive: true
        };
        
        const admin = new UserModel(adminData);
        await admin.save();
        
        console.log('SUCCESS: Admin user created successfully!');
        console.log('Email: admin@gymmanager.com');
        console.log('Password: Admin123!');
        console.log('WARNING: Please change the password after first login');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
