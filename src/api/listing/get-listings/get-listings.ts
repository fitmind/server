import { NextFunction, Response, Request } from 'express';
import ListingModel, { ListingModelType } from '../listing.model';
import { OK, BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import CONFIG from '../../../config/config';

const getListings = async (req: Request, res: Response, next: NextFunction) => {
  // todo: parameters I need is page, filter = price, expertise
  // const listings = await ListingModel.find();
};

export default getListings;
