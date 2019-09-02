import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';
import ListingModel from '../../listing/listing.model';

const adminGetListingById = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  if (!id || id.length !== 24) {
    next(new HttpException(BAD_REQUEST, 'Listing id is invalid'));
  } else {
    try {
      const listing = await ListingModel.findById(id);
      res.status(OK).json(listing);
    } catch (e) {
      next(new HttpException(NOT_FOUND, 'Could not find listing'));
    }
  }
};

export default adminGetListingById;
