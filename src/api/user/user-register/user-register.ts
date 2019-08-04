import { NextFunction, Request, Response } from 'express';
import { CREATED, CONFLICT } from 'http-status-codes';
import UserModel from '../user.model';
import HttpException from '../../../interfaces/HttpException';
import * as bcrypt from 'bcrypt';

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  const emailExists = await UserModel.findOne({ email: req.body.email });
  if (emailExists) {
    setImmediate(() => {
      next(new HttpException(CONFLICT, 'Email is already in use'));
    });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createdUser = await UserModel.create({ ...req.body, password: hashedPassword });
    res.sendStatus(CREATED);
  }
};

export default userRegister;
