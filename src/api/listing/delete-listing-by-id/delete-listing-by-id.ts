import { NextFunction, Response } from 'express';
import ListingModel, { ListingModelType } from '../listing.model';
import { OK, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';

const deleteListingById = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const expert = req.expert;
  const expertId = expert ? expert.id : '';
  const listingId = req.params.id;
  try {
    const listing = (await ListingModel.findById(listingId)) as ListingModelType;
    if (listing.createdByExpert.toString() !== expertId.toString()) {
      next(new HttpException(UNAUTHORIZED, 'Listings can only be eliminated by the person who created them'));
    } else {
      try {
        const deleted = (await ListingModel.findByIdAndDelete(listingId)) as ListingModelType;
        res.status(OK).json({ message: `Listing with ID: ${deleted._id} deleted successfully` });
      } catch (e) {
        next(new HttpException(INTERNAL_SERVER_ERROR, 'Error deleting the Listing'));
      }
    }
  } catch (e) {
    next(new HttpException(BAD_REQUEST, 'Could not find a listing with that ID'));
  }
};

export default deleteListingById;
