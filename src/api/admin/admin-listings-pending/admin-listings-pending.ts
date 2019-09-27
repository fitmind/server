import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import ListingModel from '../../listing/listing.model';

const adminListingsPending = async (req: Request, res: Response) => {
  const listings = await ListingModel.find({ approvedStatus: CONFIG.ApprovedStatus.PENDING }).populate({
    path: 'createdByExpert',
    select: CONFIG.defaultBookingPopulate
  });
  res.status(OK).json({ listings });
};

export default adminListingsPending;
