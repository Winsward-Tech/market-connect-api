//user schema with role management
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
// import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['farmer', 'market-woman', 'admin', 'logistics'], default: 'farmer' },
  pin: { type: String, required: true },
}, { timestamps: true });

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

userSchema.plugin(normalize);
export default mongoose.model('User', userSchema);

