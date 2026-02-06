import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeetCodeProfile extends Document {
  username: string;
  avatar?: string;
  solvedStats: {
    difficulty: string;
    count: number;
    submissions: number;
  }[];
  recentSubmissions: {
    title: string;
    titleSlug: string;
    timestamp: string;
  }[];
  lastUpdated: Date;
}

const LeetCodeProfileSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  avatar: { type: String },
  solvedStats: [{
    difficulty: { type: String },
    count: { type: Number },
    submissions: { type: Number }
  }],
  recentSubmissions: [{
    title: { type: String },
    titleSlug: { type: String },
    timestamp: { type: String }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

const LeetCodeProfile: Model<ILeetCodeProfile> = mongoose.models.LeetCodeProfile || mongoose.model<ILeetCodeProfile>('LeetCodeProfile', LeetCodeProfileSchema);

export default LeetCodeProfile;
