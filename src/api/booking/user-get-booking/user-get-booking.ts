import { NextFunction, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import getBookingDefaultReturn from '../../../utils/get-booking-default-return/get-booking-default-return';

const userGetBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const bookingId = req.params.bookingId;
  const userId = req.user ? req.user.id : '';
  try {
    const booking = await getBookingDefaultReturn(bookingId);
    if (!booking) {
      setImmediate(() => {
        next(new HttpException(NOT_FOUND, 'Could not find booking'));
      });
    } else {
      if (booking.customer.id !== userId) {
        setImmediate(() => {
          next(new HttpException(BAD_REQUEST, 'Booking does not belong to the user'));
        });
      } else {
        res.status(OK).json(booking);
      }
    }
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(NOT_FOUND, 'Error retrieving the booking'));
    });
  }
};

export default userGetBooking;
