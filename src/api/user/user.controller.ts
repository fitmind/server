import express, { Router } from 'express';
import userRegister from './user-register/user-register';
import userRegisterDto from './user-register/user-register-dto';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userLogin from './user-login/user.login';
import userLoginDto from './user-login/user.login.dto';

export const createUserRouter = (router: Router): Router => {
  router.post('/register', typeValidationMiddleware(userRegisterDto), userRegister);
  router.post('/login', typeValidationMiddleware(userLoginDto), userLogin);
  return router;
};

const UserController = createUserRouter(express.Router());

export default UserController;
