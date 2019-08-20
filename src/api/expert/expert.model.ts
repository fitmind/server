import * as mongoose from 'mongoose';
import CONFIG, { ApprovedStatus } from '../../config/config';

interface ExpertInterface {
  name: string;
  email: string;
  description: string;
  password: string;
  pictureUrl: string;
  createdTimeStamp: string;
  approvedStatus: string;
  isAnExpertIn: string[];
  bookings: string[];
  weeklyAvailability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}

const ExpertSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  password: String,
  pictureUrl: String,
  createdTimeStamp: { type: Date, default: Date.now },
  approvedStatus: { type: String, default: ApprovedStatus.PENDING },
  isAnExpertIn: [String],
  bookings: {
    ref: CONFIG.modelNames.booking,
    type: mongoose.Schema.Types.ObjectId
  },
  weeklyAvailability: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String]
  }
});

export type ExpertModelType = ExpertInterface & mongoose.Document;

const ExpertModel = mongoose.model<ExpertModelType>(CONFIG.modelNames.expert, ExpertSchema);

export default ExpertModel;
