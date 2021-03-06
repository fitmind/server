import { Request, Response, NextFunction } from 'express';
import HttpException from '../../utils/http-exception/http-exception';

// noinspection JSUnusedLocalSymbols
function errorHandlerMiddleware(error: HttpException, req: Request, res: Response, next: NextFunction): void {
  res.status(error.status || 500).send({ message: error.message });
}

export default errorHandlerMiddleware;
