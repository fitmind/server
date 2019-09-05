import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import HttpException from '../../utils/http-exception/http-exception';

function queryParamsValidationMiddleware<T>(type: any): express.RequestHandler {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    validate(plainToClass(type, req.query)).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        next(new HttpException(BAD_REQUEST, message));
      } else {
        next();
      }
    });
  };
}

export default queryParamsValidationMiddleware;
