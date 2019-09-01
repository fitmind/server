import * as mongoose from 'mongoose';
import CONFIG from '../../config/config';
import Booking from '../../interfaces/booking.interface';

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

export type BookingModelType = Booking & mongoose.Document;

const BookingModel = mongoose.model<BookingModelType>(CONFIG.modelNames.booking, BookingSchema);

export default BookingModel;
