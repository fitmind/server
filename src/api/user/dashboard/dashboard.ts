import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';

const userDashboard = (req: RequestWithUser, res: Response) => {
  res.status(OK);
};

export default userDashboard;
