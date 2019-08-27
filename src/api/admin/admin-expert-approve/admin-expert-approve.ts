import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import ExpertModel from '../../expert/expert.model';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';
import { ApprovedStatus } from '../../../config/config';

const adminExpertApprove = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.expertId as string;
  if (!id || id.length !== 24) {
    setImmediate(() => {
      next(new HttpException(BAD_REQUEST, 'Expert id is invalid'));
    });
    return;
  }
  try {
    const approvedStatus = req.body.approved ? ApprovedStatus.APPROVED : ApprovedStatus.DENIED;
    await ExpertModel.findByIdAndUpdate(id, { approvedStatus });
    res.sendStatus(OK);
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(NOT_FOUND, 'Could not update the expert'));
    });
  }
};

export default adminExpertApprove;
