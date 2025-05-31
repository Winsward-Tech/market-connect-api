//user schema with role management
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';
// import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        return /^233\d{9}$/.test(v); // Ghana phone number format
      },
      message: props => `${props.value} is not a valid Ghana phone number!`
    }
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['farmer', 'market_woman', 'admin'] 
  },
  location: { type: String, required: true },
  preferredLanguage: { 
    type: String, 
    required: true, 
    enum: ['en', 'tw', 'ga', 'ewe'] 
  },
  pin: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v); // 6-digit PIN
      },
      message: props => `${props.value} is not a valid 6-digit PIN!`
    }
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
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

