import express, { Request, Response, Router, NextFunction } from 'express';

const healthController: Router = express.Router();

healthController.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'App healthy :)' });
});

healthController.get('/error', (req: Request, res: Response, next: NextFunction) => {
  setImmediate(() => {
    next(new Error('App is unhealthy :('));
  });
});

export default healthController;
