import * as mongoose from 'mongoose';
import CONFIG from '../../config/config';

interface BookingInterface {
  time: Date;
  expert: string;
  listing: string;
  customer: string;
}

const BookingSchema = new mongoose.Schema({
  time: Date || String,
  customer: {
    ref: CONFIG.modelNames.user,
    type: mongoose.Schema.Types.ObjectId
  },
  listing: {
    ref: CONFIG.modelNames.listing,
    type: mongoose.Schema.Types.ObjectId
  },
  expert: {
    ref: CONFIG.modelNames.expert,
    type: mongoose.Schema.Types.ObjectId
  }
});

export type bookingModelType = BookingInterface & mongoose.Document;

const BookingModel = mongoose.model<bookingModelType>(CONFIG.modelNames.booking, BookingSchema);

export default BookingModel;
