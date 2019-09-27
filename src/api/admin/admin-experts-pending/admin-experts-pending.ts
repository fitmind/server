import { Request, Response } from 'express';
import { OK } from 'http-status-codes';
import CONFIG from '../../../config/config';
import ExpertModel from '../../expert/expert.model';
import { omit } from 'ramda';

const adminExpertsPending = async (req: Request, res: Response) => {
  const experts = await ExpertModel.find({ approvedStatus: CONFIG.ApprovedStatus.PENDING });
  const filtered = experts.map(expert => omit(['password'], expert));
  res.status(OK).json(filtered);
};

export default adminExpertsPending;
