import { mongoose } from '../config/db/connection.js'; // Import mongoose from the connection
import { encryptPassword } from '../library/appBCrypt.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // const bcrypt = await import('bcryptjs');
    // this.password = await bcrypt.default.hash(this.password, 10);
    this.password = await encryptPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to hash the password in an update request
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const plainPwd = update.password;
  if (!plainPwd) return next();

  try {
    const hashed = await encryptPassword(update.password);

    update.password = hashed;

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('user', userSchema);