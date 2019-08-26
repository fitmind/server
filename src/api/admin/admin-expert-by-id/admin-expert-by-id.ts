import { NextFunction, Response } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';
import { omit } from 'ramda';
import HttpException from '../../../utils/http-exception/http-exception';
import ExpertModel from '../../expert/expert.model';
import RequestWithAdminInterface from '../../../interfaces/request-with-admin.interface';

const AdminGetExpertById = async (req: RequestWithAdminInterface, res: Response, next: NextFunction) => {
  const id = req.params.expertId as string;
  if (!id || id.length !== 24) {
    setImmediate(() => {
      next(new HttpException(BAD_REQUEST, 'Expert id is invalid'));
    });
    return;
  }
  try {
    const expert = await ExpertModel.findById(id);
    const filtered = omit(['password'], expert);
    res.status(OK).json({ ...filtered });
  } catch (e) {
    setImmediate(() => {
      next(new HttpException(NOT_FOUND, 'Could not find expert'));
    });
  }
};

export default AdminGetExpertById;
