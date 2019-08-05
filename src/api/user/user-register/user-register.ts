import { NextFunction, Request, Response } from 'express';
import { CREATED, CONFLICT } from 'http-status-codes';
import UserModel from '../user.model';
import HttpException from '../../../interfaces/HttpException';
import * as bcrypt from 'bcrypt';
import sendEmail, { EMAILS } from '../../../utils/sendEmail';
import filterUser from '../../../utils/filter-user/filter-user';

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const emailExists = await UserModel.findOne({ email });
  if (emailExists) {
    setImmediate(() => {
      next(new HttpException(CONFLICT, 'Email is already in use'));
    });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createdUser = await UserModel.create({ ...req.body, password: hashedPassword });
    if (process.env.NODE_ENV !== 'test') {
      // todo: once AWS has unblocked restrictions it should be like this: sendEmail(EMAILS.USER_REGISTER,[email]);
      sendEmail(EMAILS.USER_REGISTER, ['hello.fitmind@gmail.com']);
    }
    res.status(CREATED).json(filterUser(createdUser));
  }
};

export default userRegister;
