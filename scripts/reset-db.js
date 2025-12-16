import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Eliminar todas las colecciones
    await mongoose.connection.db.dropDatabase();
    console.log('Base de datos limpiada');

    await mongoose.connection.close();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetDatabase();
