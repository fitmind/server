import { NextFunction, Request, Response } from 'express';
import { CREATED, CONFLICT } from 'http-status-codes';
import UserModel from '../user.model';
import HttpException from '../../../utils/http-exception/http-exception';
import * as bcrypt from 'bcrypt';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';
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
      sendEmail(EMAILS.USER_REGISTER, [email]);
    }
    res.status(CREATED).json(filterUser(createdUser));
  }
};

export default userRegister;
