import { NextFunction, Request, Response } from 'express';
import { NOT_FOUND, UNAUTHORIZED, OK } from 'http-status-codes';
import HttpException from '../../../utils/http-exception/http-exception';
import * as bcrypt from 'bcrypt';
import createUserToken from '../../../utils/create-token/create-token';
import CONFIG from '../../../config/config';
import AdminModel from '../admin.model';

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  AdminModel.findOne({ email: req.body.email }).then(async adminUser => {
    if (!adminUser) {
      next(new HttpException(NOT_FOUND, 'Email not found'));
    } else {
      const isPasswordMatching = await bcrypt.compare(req.body.password, adminUser.password);
      if (!isPasswordMatching) {
        next(new HttpException(UNAUTHORIZED, 'Passwords dont match'));
      } else {
        const token = createUserToken(adminUser._id);
        res.cookie(CONFIG.cookies.admin, token, {
          maxAge: CONFIG.authTokenExpiryDate,
          httpOnly: true
        });
        res.sendStatus(OK);
      }
    }
  });
};

export default adminLogin;
