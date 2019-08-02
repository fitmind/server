import express, { Request, Response, Router } from 'express';
import { CREATED } from 'http-status-codes';

const UserController: Router = express.Router();

UserController.post('/register', (req: Request, res: Response) => {
  res.send(CREATED);
});

export default UserController;
