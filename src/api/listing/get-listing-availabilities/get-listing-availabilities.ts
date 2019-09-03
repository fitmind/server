import { NextFunction, Response, Request } from 'express';
import ListingModel, { ListingModelType } from '../listing.model';
import { OK, BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import CONFIG from '../../../config/config';
import { getAvailabilities } from '../../../utils/get-availabilities/get-availabilities';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';

const getListingAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = (await ListingModel.findById(req.params.id)) as ListingModelType;
    if (listing.approvedStatus !== CONFIG.ApprovedStatus.APPROVED) {
      next(new HttpException(BAD_REQUEST, 'Only approved listings are available'));
    } else {
      const expert = (await ExpertModel.findById(listing.createdByExpert)) as ExpertModelType;
      const weeklyAvailabilities = expert.weeklyAvailability;
      const availability = getAvailabilities(weeklyAvailabilities);
      res.status(OK).json({ listing: { id: listing.id, name: listing.name }, availability });
    }
  } catch (e) {
    next(new HttpException(BAD_REQUEST, 'Error retrieving the listing by this ID'));
  }
};

export default getListingAvailabilities;
