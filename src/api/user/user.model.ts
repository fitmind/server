import * as mongoose from 'mongoose';
import UserInterface from '../../interfaces/user-interface';
import CONFIG from '../../config/config';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  pictureUrl: String,
  interestedInExpertiseAreas: [String],
  createdTimeStamp: { type: Date, default: Date.now }
});

export type UserModelType = UserInterface & mongoose.Document;

const UserModel = mongoose.model<UserModelType>(CONFIG.modelNames.user, UserSchema);

export default UserModel;
