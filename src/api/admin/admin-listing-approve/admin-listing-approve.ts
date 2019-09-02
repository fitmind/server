import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';
import { ApprovedStatus } from '../../../config/config';
import ListingModel from '../../listing/listing.model';

const adminListingApprove = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.listingId as string;
  if (!id || id.length !== 24) {
    next(new HttpException(BAD_REQUEST, 'Listing id is invalid'));
  } else {
    try {
      const approvedStatus = req.body.approved ? ApprovedStatus.APPROVED : ApprovedStatus.DENIED;
      await ListingModel.findByIdAndUpdate(id, { approvedStatus });
      res.sendStatus(OK);
    } catch (e) {
      next(new HttpException(NOT_FOUND, 'Could not update the expert'));
    }
  }
};

export default adminListingApprove;
