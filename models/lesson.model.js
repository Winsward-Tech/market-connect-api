// Schema for multilingual educational content.

import mongoose from 'mongoose';
import normalize from 'normalize-mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  language: { type: String, enum: ['twi', 'ewe', 'ga', 'dagbani','english'], default:'english', required: true },
}, { timestamps: true });

lessonSchema.plugin(normalize);

export default mongoose.model('Lesson', lessonSchema);




