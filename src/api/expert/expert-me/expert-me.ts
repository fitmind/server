import { Response } from 'express';
import { OK } from 'http-status-codes';
import { pick } from 'ramda';
import { ExpertModelType } from '../expert.model';
import WeeklyAvailability from '../../../interfaces/weeklyAvailability.interface';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import BookingModel, { BookingModelType } from '../../booking/booking.model';
import CONFIG from '../../../config/config';

interface FilteredExpert {
  id: string;
  name: string;
  email: string;
  description?: string;
  isAnExpertIn: string[];
  weeklyAvailability: WeeklyAvailability;
  approvedStatus: string;
}

export const filterExpertMe = (expert: ExpertModelType): FilteredExpert =>
  pick(['id', 'name', 'email', 'description', 'isAnExpertIn', 'weeklyAvailability', 'approvedStatus'], expert);

const getExpertMe = async (req: RequestWithExpert, res: Response) => {
  const expert = req.expert as ExpertModelType;
  const bookings = await BookingModel.find({ expert: expert.id })
    .populate({
      path: 'customer',
      select: CONFIG.defaultBookingPopulate
    })
    .populate({
      path: 'listing',
      select: CONFIG.defaultBookingPopulate
    })
    .populate({
      path: 'expert',
      select: CONFIG.defaultBookingPopulate
    });
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  const pastBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) < now);
  const futureBookings = bookings.filter((booking: BookingModelType) => new Date(booking.time) > now);
  const expertFiltered = filterExpertMe(expert);
  res.status(OK).json({ ...expertFiltered, pastBookings, futureBookings });
};

export default getExpertMe;
