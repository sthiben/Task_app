import { connectDB, mongoose } from '../config/db/connection.js';
import Class from '../models/class.model.js';
import UserModel from '../models/user.model.js';

const cleanDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Cleaning database...\n');
        
        // Clean classes
        const classResult = await Class.deleteMany({});
        console.log(`SUCCESS: Deleted ${classResult.deletedCount} classes`);
        
        // Clean users (except admins)
        const userResult = await UserModel.deleteMany({ role: { $ne: 'admin' } });
        console.log(`SUCCESS: Deleted ${userResult.deletedCount} users (admins preserved)`);
        
        console.log('\nSUCCESS: Database cleaned successfully');
        
        await mongoose.connection.close();
        console.log('SUCCESS: Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Error cleaning database:', error.message);
        process.exit(1);
    }
};

// Check if user wants to clean everything including admins
const args = process.argv.slice(2);
const cleanAll = args.includes('--all');

if (cleanAll) {
    console.log('WARNING: This will delete ALL data including admin users!');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...\n');
    
    setTimeout(async () => {
        try {
            await connectDB();
            
            const classResult = await Class.deleteMany({});
            const userResult = await UserModel.deleteMany({});
            
            console.log(`SUCCESS: Deleted ${classResult.deletedCount} classes`);
            console.log(`SUCCESS: Deleted ${userResult.deletedCount} users`);
            console.log('\nSUCCESS: Database completely cleaned');
            
            await mongoose.connection.close();
            process.exit(0);
        } catch (error) {
            console.error('ERROR:', error.message);
            process.exit(1);
        }
    }, 5000);
} else {
    cleanDatabase();
}
