import * as mongoose from 'mongoose';

interface UserInterface {
  id: string;
  name: string;
  description?: string;
  password: string;
  interestedInExperiseAreas: String[];
  created: string;
  approved: boolean;
  rating: number;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  interestedInExperiseAreas: [String],
  created: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
});

const UserModel = mongoose.model<UserInterface & mongoose.Document>('User', UserSchema);

export default UserModel;
