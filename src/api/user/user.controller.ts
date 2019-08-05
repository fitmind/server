import express, { Router } from 'express';
import userRegister from './user-register/user-register';
import userRegisterDto from './user-register/user-register-dto';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';

export const createUserRouter = (router: Router): Router => {
  router.post('/register', typeValidationMiddleware(userRegisterDto), userRegister);
  return router;
};

const UserController = createUserRouter(express.Router());

export default UserController;
