import { NextFunction, Response } from 'express';
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import BookingModel from '../booking.model';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import CONFIG from '../../../config/config';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import { getAvailabilities } from '../../../utils/get-availabilities/get-availabilities';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';
import { UserModelType } from '../../user/user.model';

const createBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user as UserModelType;
  const listingId = req.params.listingId;
  try {
    const listing = (await ListingModel.findById(listingId)) as ListingModelType;
    if (!listing) {
      next(new HttpException(NOT_FOUND, 'Listing not found'));
    } else if (listing.approvedStatus !== CONFIG.ApprovedStatus.APPROVED) {
      next(new HttpException(BAD_REQUEST, 'Not possible to create bookings on not approved listings'));
    } else {
      // Need to check for all availabilities in the next month
      const expert = (await ExpertModel.findById(listing.createdByExpert)) as ExpertModelType;
      const allBookings = await BookingModel.find({ expert: expert.id });
      const bookings = allBookings.map(booking => booking.time);
      const availability = getAvailabilities(expert.weeklyAvailability, bookings);
      const availabilityTimes = availability.map(date => new Date(date).getTime());
      const date = new Date(req.body.time);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if (!availabilityTimes.includes(date.getTime())) {
        next(new HttpException(BAD_REQUEST, 'Not possible to create a booking at that time'));
      } else {
        const booking = await BookingModel.create({
          time: req.body.time,
          customer: user.id,
          listing: listingId,
          expert: listing.createdByExpert
        });
        if (process.env.NODE_ENV !== 'test') {
          const subject = `Fitmind: You have an upcoming ${booking.time.toString()}`;
          sendEmail(EMAILS.BOOKING_CONFIRMATION, [expert.email], subject);
          sendEmail(EMAILS.BOOKING_CONFIRMATION, [user.email], subject);
        }
        res.status(CREATED).json({ message: `Booking with ID: ${booking.id} created` });
      }
    }
  } catch (e) {
    next(new HttpException(INTERNAL_SERVER_ERROR, 'Error creating the listing'));
  }
};

export default createBooking;
