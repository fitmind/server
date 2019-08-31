import { Response } from 'express';
import { OK } from 'http-status-codes';
import { pick } from 'ramda';
import { ExpertModelType } from '../expert.model';
import WeeklyAvailability from '../../../interfaces/weeklyAvailability.interface';
import RequestWithExpert from '../../../interfaces/request-with-expert.interface';

interface FilteredExpert {
  id: string;
  name: string;
  email: string;
  description?: string;
  isAnExpertIn: string[];
  weeklyAvailability: WeeklyAvailability;
  approvedStatus: string;
}

export const filterExpertMe = (expert: ExpertModelType): FilteredExpert =>
  pick(['id', 'name', 'email', 'description', 'isAnExpertIn', 'weeklyAvailability', 'approvedStatus'], expert);

const getExpertMe = (req: RequestWithExpert, res: Response) => {
  res.status(OK).json(filterExpertMe(req.expert as ExpertModelType));
};

export default getExpertMe;
