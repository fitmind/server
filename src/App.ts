import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import errorHandlerMiddleware from './middleware/error-handler-middleware/error-handler-middleware';
import healthRouter from './api/health/health.router';
import userRouter from './api/user/user.router';
import expertRouter from './api/expert/expert.router';
import adminRouter from './api/admin/admin.router';
import listingRouter from './api/listing/listing.router';
import bookingRouter from './api/booking/booking.router';

const createApp = (app: express.Application): express.Application => {
  // app middleware
  app.use(
    helmet({
      hidePoweredBy: true
    })
  );
  app.use(compression());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  // app routes
  app.get('/', (_req: Request, res: Response) => {
    res.send({ message: 'welcome to the Fitmind API' });
  });

  app.use('/health', healthRouter);
  app.use('/user', userRouter);
  app.use('/expert', expertRouter);
  app.use('/admin', adminRouter);
  app.use('/listings', listingRouter);
  app.use('/bookings', bookingRouter);

  // // error handler
  app.use(errorHandlerMiddleware);

  return app;
};

export default createApp;
