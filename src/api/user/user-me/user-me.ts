import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import { pick } from 'ramda';
import { UserModelType } from '../user.model';

interface FilteredUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
}

export const filterUserMe = (user: UserModelType): FilteredUser =>
  pick(['_id', 'firstName', 'lastName', 'email', 'description', 'interestedInExpertiseAreas'], user);

const getUserMe = (req: RequestWithUser, res: Response) => {
  res.status(OK).json(filterUserMe(req.user as UserModelType));
};

export default getUserMe;
