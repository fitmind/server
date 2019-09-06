import { NextFunction, Response, Request } from 'express';
import ListingModel from '../listing.model';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import CONFIG, { ApprovedStatus } from '../../../config/config';

interface Conditions {
  price?: any;
  approvedStatus: ApprovedStatus.APPROVED;
  expertiseArea?: string;
}

const projection = '-approvedStatus';

const getListings = async (req: Request, res: Response, next: NextFunction) => {
  const { page, min_price, max_price, expertise, size = 10 } = req.query;
  // if no page number is send - default it to 1
  const pageNumber = parseInt(page) || 1;
  const limit = parseInt(size);
  let options = { skip: size * (pageNumber - 1), limit };
  let conditions: Conditions = { approvedStatus: CONFIG.ApprovedStatus.APPROVED };
  if (min_price) {
    conditions.price = { ...conditions.price, $gte: min_price };
  }
  if (max_price) {
    conditions.price = { ...conditions.price, $lte: max_price };
  }
  if (expertise) {
    conditions.expertiseArea = expertise;
  }
  try {
    const listings = await ListingModel.find(conditions, projection, options).sort({ createdTimeStamp: 'descending' });
    res.status(OK).json(listings);
  } catch (e) {
    next(new HttpException(INTERNAL_SERVER_ERROR, 'Error retrieving the listings'));
  }
};

export default getListings;
