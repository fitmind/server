import { NextFunction, Response } from 'express';
import { NOT_FOUND, BAD_REQUEST, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import getBookingDefaultReturn from '../../../utils/get-booking-default-return/get-booking-default-return';

const expertGetBooking = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const bookingId = req.params.bookingId;
  const expertId = req.expert ? req.expert.id : '';
  try {
    const booking = await getBookingDefaultReturn(bookingId);
    if (!booking) {
      setImmediate(() => {
        next(new HttpException(NOT_FOUND, 'Could not find booking'));
      });
    } else {
      if (booking.expert.id !== expertId) {
        setImmediate(() => {
          next(new HttpException(BAD_REQUEST, 'Booking does not belong to the expert'));
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

export default expertGetBooking;
