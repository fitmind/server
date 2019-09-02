import { NextFunction, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import BookingModel from '../booking.model';

const userDeleteBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const bookingId = req.params.bookingId;
  const userId = req.user ? req.user.id : '';
  try {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      next(new HttpException(NOT_FOUND, 'Could not find booking'));
    } else {
      if (booking.customer.toString() !== userId.toString()) {
        next(new HttpException(BAD_REQUEST, 'Booking does not belong to the user'));
      } else {
        await BookingModel.findByIdAndDelete(bookingId);
        res.sendStatus(OK);
      }
    }
  } catch (e) {
    next(new HttpException(NOT_FOUND, 'Error retrieving the booking'));
  }
};

export default userDeleteBooking;
