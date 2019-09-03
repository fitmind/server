import * as mongoose from 'mongoose';
import CONFIG, { ApprovedStatus } from '../../config/config';
import ListingInterface from '../../interfaces/listing.interface';

const ListingSchema = new mongoose.Schema({
  name: String,
  description: String,
  pictureUrl: String,
  price: String,
  createdTimeStamp: { type: Date, default: Date.now },
  approvedStatus: { type: String, default: ApprovedStatus.PENDING },
  expertiseArea: String,
  createdByExpert: {
    ref: CONFIG.modelNames.expert,
    type: mongoose.Schema.Types.ObjectId
  },
  postCode: String
});

export type ListingModelType = ListingInterface & mongoose.Document;

const ListingModel = mongoose.model<ListingModelType>(CONFIG.modelNames.listing, ListingSchema);

export default ListingModel;
