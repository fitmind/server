import { NextFunction, Response } from 'express';
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import BookingModel from '../booking.model';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import CONFIG from '../../../config/config';

const createBooking = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user ? req.user.id : '';
  const listingId = req.params.listingId;
  // todo: will have to check that the booking is also in the available slots for the Listing
  try {
    const listing = (await ListingModel.findById(listingId)) as ListingModelType;
    if (!listing) {
      setImmediate(() => {
        next(new HttpException(NOT_FOUND, 'Listing not found'));
      });
    } else if (listing.approvedStatus !== CONFIG.ApprovedStatus.APPROVED) {
      setImmediate(() => {
        next(new HttpException(BAD_REQUEST, 'Not possible to create bookings on not approved listings'));
      });
    } else {
      const booking = await BookingModel.create({
        time: req.body.time,
        customer: userId,
        listing: listingId,
        expert: listing.createdByExpert
      });
      res.status(CREATED).json({ message: `Booking with ID: ${booking.id} created` });
    }
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(INTERNAL_SERVER_ERROR, 'Error creating the listing'));
    });
  }
};

export default createBooking;
