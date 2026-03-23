import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProblem extends Document {
  problemId: number;
  title: string;
  description: string;
  isPremium: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solutionLink: string;
  acceptanceRate: number;
  frequency: number;
  url: string;
  discussCount: number;
  accepted: number;
  submissions: number;
  companies: string[];
  relatedTopics: string[];
  likes: number;
  dislikes: number;
  rating: number;
  askedByFaang: boolean;
  similarQuestions: string;
  starterCode?: Map<string, string>;
}

const ProblemSchema: Schema = new Schema({
  problemId: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true,
    index: true
  },
  solutionLink: { type: String },
  acceptanceRate: { type: Number },
  frequency: { type: Number },
  url: { type: String },
  discussCount: { type: Number },
  accepted: { type: Number },
  submissions: { type: Number },
  companies: [{ type: String }],
  relatedTopics: [{ type: String }],
  likes: { type: Number },
  dislikes: { type: Number },
  rating: { type: Number },
  askedByFaang: { type: Boolean, default: false, index: true },
  similarQuestions: { type: String },
  starterCode: { type: Map, of: String }
});

// Indexes for common queries
ProblemSchema.index({ title: 'text', description: 'text' });
ProblemSchema.index({ companies: 1 });
ProblemSchema.index({ relatedTopics: 1 });
ProblemSchema.index({ acceptanceRate: -1 });

const Problem: Model<IProblem> = mongoose.models.Problem || mongoose.model<IProblem>('Problem', ProblemSchema);

export default Problem;
