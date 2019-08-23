import { BAD_REQUEST, OK } from 'http-status-codes';
import { NextFunction, Response } from 'express';
import HttpException from '../../../utils/http-exception/http-exception';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';
import ExpertModel, { ExpertModelType } from '../expert.model';

const updateExpert = async (req: RequestWithExpert, res: Response, next: NextFunction) => {
  const expert = req.expert as ExpertModelType;
  try {
    await ExpertModel.findByIdAndUpdate(expert._id, req.body, {}).exec();
    res.sendStatus(OK);
  } catch (e) {
    next(new HttpException(BAD_REQUEST, 'User could not be updated at this time, please try again later'));
  }
};

export default updateExpert;
