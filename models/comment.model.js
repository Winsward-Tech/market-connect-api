//To handle comments on the forum
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const commentSchema = new mongoose.Schema({
  forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

commentSchema.plugin(normalize);
export default mongoose.model('Comment', commentSchema);