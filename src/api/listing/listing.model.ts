import * as mongoose from 'mongoose';
import CONFIG, { ApprovedStatus } from '../../config/config';

interface ListingInterface {
  name: string;
  description: string;
  pictureUrl: string;
  createdTimeStamp: string;
  approvedStatus: string;
  expertiseArea: string;
  createdByExpert: string;
}

const ListingSchema = new mongoose.Schema({
  name: String,
  description: String,
  pictureUrl: String,
  createdTimeStamp: { type: Date, default: Date.now },
  approvedStatus: { type: String, default: ApprovedStatus.PENDING },
  expertiseArea: String,
  createdByExpert: {
    ref: CONFIG.modelNames.expert,
    type: mongoose.Schema.Types.ObjectId
  }
});

export type ListingModelType = ListingInterface & mongoose.Document;

const ListingModel = mongoose.model<ListingModelType>(CONFIG.modelNames.listing, ListingSchema);

export default ListingModel;
