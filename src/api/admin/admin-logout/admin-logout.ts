import { Request, Response } from 'express';
import CONFIG from '../../../config/config';
import { OK } from 'http-status-codes';

const adminLogout = (req: Request, res: Response) => {
  res.clearCookie(CONFIG.cookies.admin);
  res.sendStatus(OK);
};

export default adminLogout;
