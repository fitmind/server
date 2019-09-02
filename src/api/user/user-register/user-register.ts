import { NextFunction, Request, Response } from 'express';
import { CREATED, CONFLICT, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import UserModel from '../user.model';
import HttpException from '../../../utils/http-exception/http-exception';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';
import encryptPassword from '../../../utils/encrypt-password/encrypt-password';

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const emailExists = await UserModel.findOne({ email });
  if (emailExists) {
    next(new HttpException(CONFLICT, 'Email is already in use'));
  } else {
    const hashedPassword = await encryptPassword(req.body.password);
    try {
      await UserModel.create({ ...req.body, password: hashedPassword });
      if (process.env.NODE_ENV !== 'test') {
        sendEmail(EMAILS.USER_REGISTER, [email]);
      }
      res.sendStatus(CREATED);
    } catch (e) {
      next(new HttpException(INTERNAL_SERVER_ERROR, 'Error saving the user'));
    }
  }
};

export default userRegister;
