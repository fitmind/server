import { Request } from 'express';
import { ExpertModelType } from '../api/expert/expert.model';

export default interface RequestWithExpert extends Request {
  expert?: ExpertModelType;
}
