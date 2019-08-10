import express, { Request, Response, Router, NextFunction } from 'express';

const healthRouter: Router = express.Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'App healthy :)' });
});

healthRouter.get('/error', (req: Request, res: Response, next: NextFunction) => {
  setImmediate(() => {
    next(new Error('App is unhealthy :('));
  });
});

export default healthRouter;
