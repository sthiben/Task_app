import { connectDB, mongoose } from '../config/db/connection.js';

const dropTasksCollection = async () => {
    try {
        await connectDB();
        
        // Check if tasks collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const tasksExists = collections.some(col => col.name === 'tasks');
        
        if (!tasksExists) {
            console.log('WARNING: Tasks collection does not exist');
            await mongoose.connection.close();
            process.exit(0);
        }
        
        // Drop the tasks collection
        await mongoose.connection.db.dropCollection('tasks');
        console.log('SUCCESS: Tasks collection dropped successfully');
        
        await mongoose.connection.close();
        console.log('SUCCESS: Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Error dropping tasks collection:', error.message);
        process.exit(1);
    }
};

dropTasksCollection();
