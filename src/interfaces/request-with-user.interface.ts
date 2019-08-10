import UserInterface from './user-interface';
import { Request } from 'express';

export default interface RequestWithUser extends Request {
  user?: UserInterface | null;
}
