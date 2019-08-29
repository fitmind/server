import { NextFunction, Response } from 'express';
import ListingModel, { ListingModelType } from '../listing.model';
import { OK, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';

const updateListingById = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const expert = req.expert;
  const expertId = expert ? expert.id : '';
  const listingId = req.params.id;

  try {
    const listing = (await ListingModel.findById(listingId)) as ListingModelType;
    if (listing.createdByExpert.toString() !== expertId.toString()) {
      setImmediate(() => {
        next(new HttpException(UNAUTHORIZED, 'Listings can only be updated by its creator'));
      });
    } else {
      try {
        const updated = (await ListingModel.findByIdAndUpdate(listingId, req.body)) as ListingModelType;
        res.status(OK).json({ message: `Listing with ID: ${updated._id} updated successfully` });
      } catch (e) {
        setImmediate(() => {
          next(new HttpException(INTERNAL_SERVER_ERROR, 'Error updating the Listing'));
        });
      }
    }
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(BAD_REQUEST, 'Could not find a listing with that ID'));
    });
  }
};

export default updateListingById;
