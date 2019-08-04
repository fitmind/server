import request from 'supertest';
import * as morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import createApp from './App';
import errorHandlerMiddleware from './middleware/error-handler-middleware/error-handler-middleware';
import helmet from 'helmet';
import compression from 'compression';
import healthController from './api/health/health.controller';
import UserController from './api/user/user.controller';

jest.mock('helmet');
jest.mock('compression');
jest.mock('morgan');
jest.mock('cors');
jest.mock('cookie-parser');
jest.mock('body-parser', () => ({
  json: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next()),
  urlencoded: jest.fn(() => (_req: Request, _res: Response, next: NextFunction) => next())
}));

const mockCookieParser = (cookieParser as unknown) as jest.Mock;
const mockMorgan = (morgan as unknown) as jest.Mock;
const mockCors = (cors as unknown) as jest.Mock;
const mockHelmet = (helmet as unknown) as jest.Mock;
const mockCompression = (compression as unknown) as jest.Mock;

describe('testing App', () => {
  let app: express.Application = express();
  let spy: jest.SpyInstance;

  beforeAll(() => {
    mockCookieParser.mockReturnValueOnce((_req: Request, _res: Response, next: NextFunction) => next());
    mockMorgan.mockReturnValueOnce((_req: Request, _res: Response, next: NextFunction) => next());
    mockCors.mockReturnValueOnce((_req: Request, _res: Response, next: NextFunction) => next());
    mockHelmet.mockReturnValueOnce((_req: Request, _res: Response, next: NextFunction) => next());
    mockCompression.mockReturnValueOnce((_req: Request, _res: Response, next: NextFunction) => next());

    spy = jest.spyOn(app, 'use');
    app = createApp(app);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('testing middleware', () => {
    test('should call the exact amount of middleware', () => {
      expect(spy).toHaveBeenCalledTimes(10);
    });
    test('should use helmet', () => {
      expect(helmet).toHaveBeenCalledTimes(1);
    });
    test('should use compression', () => {
      expect(compression).toHaveBeenCalledTimes(1);
    });
    test('should use cors', () => {
      expect(cors).toHaveBeenCalledTimes(1);
    });
    test('should use cookie parser', () => {
      expect(cookieParser).toHaveBeenCalledTimes(1);
    });
    test('should use morgan', () => {
      expect(morgan).toHaveBeenCalledTimes(1);
    });
    test('should use body parser json', () => {
      expect(bodyParser.json).toHaveBeenCalledTimes(1);
    });
    test('should use body parser url encoded', () => {
      expect(bodyParser.urlencoded).toHaveBeenCalledTimes(1);
    });
  });

  describe('testing app routes', () => {
    test('get method of landing', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('welcome to the Fitmind API');
    });
  });

  describe('testing the app calling the right controllers', () => {
    test('testing health controller gets called', () => {
      expect(spy).toHaveBeenNthCalledWith(8, '/health', healthController);
    });
    test('testing the user controller gets called', () => {
      expect(spy).toHaveBeenNthCalledWith(9, '/user', UserController);
    });
  });

  describe('testing the app is calling the right error handlers', () => {
    test('it should call the error handler last', () => {
      expect(spy).toHaveBeenCalledWith(errorHandlerMiddleware);
    });
  });
});
