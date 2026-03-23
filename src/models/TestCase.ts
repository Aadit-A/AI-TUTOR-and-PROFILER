import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITestCase extends Document {
  problemId: number;
  driver: string;          // C++ main() appended to user code
  compareMode: string;     // exact | sorted | unordered | float | any_valid
  tests: { input: string; expected: string; level: number }[];
}

const TestCaseSchema = new Schema({
  problemId: { type: Number, required: true, unique: true, index: true },
  driver:    { type: String, required: true },
  compareMode: { type: String, default: 'exact' },
  tests: [{ input: String, expected: String, level: { type: Number, default: 1 } }],
});

const TestCase: Model<ITestCase> = mongoose.models.TestCase || mongoose.model<ITestCase>('TestCase', TestCaseSchema);
export default TestCase;
