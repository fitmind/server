import { Request, Response } from 'express';
import { CREATED } from 'http-status-codes';

const userRegister = (req: Request, res: Response) => {
  console.log(req.body);
  res.send(CREATED);
};

export default userRegister;
