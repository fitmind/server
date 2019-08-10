import { Request, Response } from 'express';
import CONFIG from '../../../config/config';
import { OK } from 'http-status-codes';

const userLogout = (req: Request, res: Response) => {
  res.clearCookie(CONFIG.cookies.user);
  res.sendStatus(OK);
};

export default userLogout;
