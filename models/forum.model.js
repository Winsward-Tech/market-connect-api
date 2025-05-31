//Forum post schema for discussions.
import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const forumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

forumSchema.plugin(normalize);
export default mongoose.model('Forum', forumSchema);

