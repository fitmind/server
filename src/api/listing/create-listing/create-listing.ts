import { NextFunction, Response } from 'express';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import ListingModel from '../listing.model';
import { CREATED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';

const createListing = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const expertId = req.expert ? req.expert.id : '';
  try {
    await ListingModel.create({ ...req.body, createdByExpert: expertId });
    res.sendStatus(CREATED);
  } catch (e) {
    next(new HttpException(INTERNAL_SERVER_ERROR, 'Error creating the listing'));
  }
};

export default createListing;
