import { NextFunction, Response } from 'express';
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import BookingModel from '../booking.model';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import CONFIG from '../../../config/config';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import { getAvailabilities } from '../../../utils/get-availabilities/get-availabilities';

const createBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user ? req.user.id : '';
  const listingId = req.params.listingId;
  try {
    const listing = (await ListingModel.findById(listingId)) as ListingModelType;
    console.log(listing);
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
          customer: userId,
          listing: listingId,
          expert: listing.createdByExpert
        });
        res.status(CREATED).json({ message: `Booking with ID: ${booking.id} created` });
      }
    }
  } catch (e) {
    next(new HttpException(INTERNAL_SERVER_ERROR, 'Error creating the listing'));
  }
};

export default createBooking;
