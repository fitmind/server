import { Request } from 'express';
import { UserModelType } from '../api/user/user.model';

export default interface RequestWithUser extends Request {
  user?: UserModelType;
}
