import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';
import { ApprovedStatus } from '../../../config/config';
import ListingModel, { ListingModelType } from '../../listing/listing.model';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';

const adminListingApprove = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.listingId as string;
  if (!id || id.length !== 24) {
    next(new HttpException(BAD_REQUEST, 'Listing id is invalid'));
  } else {
    try {
      const approvedStatus = req.body.approved ? ApprovedStatus.APPROVED : ApprovedStatus.DENIED;
      console.log(approvedStatus);
      const listing = (await ListingModel.findByIdAndUpdate(id, { approvedStatus })) as ListingModelType;
      console.log(listing);
      const expert = (await ExpertModel.findById(listing.createdByExpert)) as ExpertModelType;
      console.log(expert);
      if (process.env.NODE_ENV !== 'test' && approvedStatus === ApprovedStatus.APPROVED) {
        console.log('sending listing aprove');
        sendEmail(EMAILS.LISTING_APPROVE, [expert.email]);
      }
      if (process.env.NODE_ENV !== 'test' && approvedStatus === ApprovedStatus.DENIED) {
        console.log('sending listing denied');
        sendEmail(EMAILS.LISTING_DENIED, [expert.email]);
      }
      res.sendStatus(OK);
    } catch (e) {
      next(new HttpException(NOT_FOUND, 'Could not update the expert'));
    }
  }
};

export default adminListingApprove;
