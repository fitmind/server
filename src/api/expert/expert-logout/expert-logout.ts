import { Request, Response } from 'express';
import CONFIG from '../../../config/config';
import { OK } from 'http-status-codes';

const expertLogout = (req: Request, res: Response) => {
  res.clearCookie(CONFIG.cookies.expert);
  res.sendStatus(OK);
};

export default expertLogout;
