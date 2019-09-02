import { NextFunction, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import BookingModel from '../booking.model';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';

const expertDeleteBooking = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const expertId = req.expert ? req.expert.id : '';
  const bookingId = req.params.bookingId;

  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      next(new HttpException(NOT_FOUND, 'Could not find booking'));
    } else {
      if (booking.expert.toString() !== expertId.toString()) {
        next(new HttpException(BAD_REQUEST, 'Booking does not belong to this expert'));
      } else {
        await BookingModel.findByIdAndDelete(bookingId);
        res.sendStatus(OK);
      }
    }
  } catch (e) {
    next(new HttpException(NOT_FOUND, 'Error retrieving the booking'));
  }
};

export default expertDeleteBooking;
