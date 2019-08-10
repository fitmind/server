import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import { pick } from 'ramda';
import { UserModelType } from '../user.model';

interface FilteredUser {
  _id: string;
  name: string;
  email: string;
  description?: string;
  interestedInExpertiseAreas: string[];
  approved: boolean;
  rating: number;
}

export const filterUserMe = (user: UserModelType): FilteredUser =>
  pick(
    ['_id', 'name', 'email', 'description', 'interestedInExpertiseAreas', 'approved', 'rating', 'createdTimeStamp'],
    user
  );

const getUserMe = (req: RequestWithUser, res: Response) => {
  res.status(OK).json(filterUserMe(req.user as UserModelType));
};

export default getUserMe;
