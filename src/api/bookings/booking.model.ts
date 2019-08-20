import * as mongoose from 'mongoose';
import CONFIG from '../../config/config';

interface BookingInterface {
  time: Date;
  createdByUser: string;
  listing: string;
}

const BookingSchema = new mongoose.Schema({
  time: Date || String,
  createdByUser: {
    ref: CONFIG.modelNames.user,
    type: mongoose.Schema.Types.ObjectId
  },
  listing: {
    ref: CONFIG.modelNames.listing,
    type: mongoose.Schema.Types.ObjectId
  }
});

export type bookingModelType = BookingInterface & mongoose.Document;

const BookingModel = mongoose.model<bookingModelType>(CONFIG.modelNames.booking, BookingSchema);

export default BookingModel;
