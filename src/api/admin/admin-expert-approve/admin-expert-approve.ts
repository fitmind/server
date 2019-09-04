import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import ExpertModel, { ExpertModelType } from '../../expert/expert.model';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';
import { ApprovedStatus } from '../../../config/config';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';

const adminExpertApprove = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.expertId as string;
  if (!id || id.length !== 24) {
    next(new HttpException(BAD_REQUEST, 'Expert id is invalid'));
  } else {
    try {
      const approvedStatus = req.body.approved ? ApprovedStatus.APPROVED : ApprovedStatus.DENIED;
      const expert = (await ExpertModel.findByIdAndUpdate(id, { approvedStatus })) as ExpertModelType;
      if (process.env.NODE_ENV !== 'test' && approvedStatus === ApprovedStatus.APPROVED) {
        console.log('sending email');
        sendEmail(EMAILS.EXPERT_APPROVE, [expert.email]);
      }
      if (process.env.NODE_ENV !== 'test' && approvedStatus === ApprovedStatus.DENIED) {
        console.log('sending email decline');
        sendEmail(EMAILS.EXPERT_DENIED, [expert.email]);
      }
      res.sendStatus(OK);
    } catch (e) {
      next(new HttpException(NOT_FOUND, 'Could not update the expert'));
    }
  }
};

export default adminExpertApprove;
