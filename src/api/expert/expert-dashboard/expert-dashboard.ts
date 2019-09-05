import { Response } from 'express';
import { OK } from 'http-status-codes';
import BookingModel, { BookingModelType } from '../../booking/booking.model';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import { ExpertModelType } from '../expert.model';

const expertDashboard = async (req: RequestWithExpert, res: Response) => {
  const expert = req.expert as ExpertModelType;
  const bookings = await BookingModel.find({ expert: expert.id });
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  const pastBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) < now);
  const futureBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) > now);
  res.status(OK).send({ pastBookings, futureBookings });
};

export default expertDashboard;
