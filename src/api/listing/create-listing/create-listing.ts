import { NextFunction, Response } from 'express';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import ListingModel from '../listing.model';
import { CREATED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';

const createListing = async ({ body }: RequestWithExpert, res: Response, next: NextFunction) => {
  try {
    await ListingModel.create(body);
    res.status(CREATED);
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(INTERNAL_SERVER_ERROR, 'Error creating the listing'));
    });
  }
};

export default createListing;
