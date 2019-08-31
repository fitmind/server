import { BAD_REQUEST, OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import UserModel, { UserModelType } from '../user.model';
import { NextFunction, Response } from 'express';
import HttpException from '../../../utils/http-exception/http-exception';

const updateUserMe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user as UserModelType;
  try {
    await UserModel.findByIdAndUpdate(user._id, req.body, {});
    res.sendStatus(OK);
  } catch (e) {
    next(new HttpException(BAD_REQUEST, 'User could not be updated at this time, please try again later'));
  }
};

export default updateUserMe;
