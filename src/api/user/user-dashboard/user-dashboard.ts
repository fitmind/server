import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import BookingModel, { BookingModelType } from '../../booking/booking.model';
import { UserModelType } from '../user.model';

const userDashboard = async (req: RequestWithUser, res: Response) => {
  const user = req.user as UserModelType;
  const bookings = await BookingModel.find({ customer: user.id });
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  const pastBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) < now);
  const futureBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) > now);
  res.status(OK).send({ pastBookings, futureBookings });
};

export default userDashboard;
