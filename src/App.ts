import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
// import postsController from './controllers/post/post.controller';
import errorHandlerMiddleware from './middleware/error-handler-middleware/error-handler-middleware';
import healthController from './health/health.controller';
import UserController from './user/user.controller';

const createApp = (app: express.Application): express.Application => {
  // app middleware
  app.use(
    helmet({
      hidePoweredBy: true,
    }),
  );
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  // app routes
  app.get('/', (_req: Request, res: Response) => {
    res.send({ message: 'welcome to the Fitmind API' });
  });

  app.use('/health', healthController);
  app.use('/user', UserController);

  // // error handler
  app.use(errorHandlerMiddleware);

  return app;
};

export default createApp;
