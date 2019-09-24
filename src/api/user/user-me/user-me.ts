import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import { pick } from 'ramda';
import { UserModelType } from '../user.model';
import BookingModel, { BookingModelType } from '../../booking/booking.model';

interface FilteredUser {
  id: string;
  name: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
}

export const filterUserMe = (user: UserModelType): FilteredUser =>
  pick(['id', 'name', 'email', 'description', 'interestedInExpertiseAreas'], user);

const getUserMe = async (req: RequestWithUser, res: Response) => {
  const user = req.user as UserModelType;
  const bookings = await BookingModel.find({ customer: user.id });
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  const pastBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) < now);
  const futureBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) > now);
  const filteredUser = filterUserMe(user);

  res.status(OK).json({ ...filteredUser, pastBookings, futureBookings });
};

export default getUserMe;
