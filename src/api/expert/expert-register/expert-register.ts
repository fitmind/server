import { NextFunction, Request, Response } from 'express';
import HttpException from '../../../utils/http-exception/http-exception';
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import * as bcrypt from 'bcrypt';
import sendEmail, { EMAILS } from '../../../utils/send-email/send-email';
import ExpertModel from '../expert.model';

const expertRegister = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const emailExists = await ExpertModel.findOne({ email });
  if (emailExists) {
    setImmediate(() => {
      next(new HttpException(CONFLICT, 'Email is already in use'));
    });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
      await ExpertModel.create({ ...req.body, password: hashedPassword });
      if (process.env.NODE_ENV !== 'test') {
        sendEmail(EMAILS.USER_REGISTER, [email]);
      }
      res.sendStatus(CREATED);
    } catch (e) {
      next(new HttpException(INTERNAL_SERVER_ERROR, 'Could not create the user'));
    }
  }
};

export default expertRegister;
