import { Request } from 'express';
import { AdminModelType } from '../api/admin/admin.model';

export default interface RequestWithAdminInterface extends Request {
  admin?: AdminModelType;
}
