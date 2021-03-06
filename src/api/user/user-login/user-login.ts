import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND, UNAUTHORIZED, CREATED } from 'http-status-codes';
import UserModel from '../user.model';
import HttpException from '../../../utils/http-exception/http-exception';
import * as bcrypt from 'bcrypt';
import createUserToken from '../../../utils/create-token/create-token';
import CONFIG from '../../../config/config';

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  UserModel.findOne({ email: req.body.email }).then(async user => {
    if (!user) {
      next(new HttpException(NOT_FOUND, 'Email not found'));
    } else {
      const isPasswordMatching = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordMatching) {
        next(new HttpException(UNAUTHORIZED, 'Passwords dont match'));
      } else {
        const token = createUserToken(user._id);
        res.cookie(CONFIG.cookies.user, token, {
          maxAge: CONFIG.authTokenExpiryDate,
          httpOnly: true
        });
        res.sendStatus(CREATED);
      }
    }
  });
};

export default userLogin;
