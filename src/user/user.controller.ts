import express, { Router } from 'express';
import userRegister from './user-register/user-register';
import userRegisterDto from './user-register/user-register-dto';
import typeValidationMiddleware from '../middleware/type-validation-middleware/type-validation-middleware';

const UserController: Router = express.Router();

UserController.post('/register', typeValidationMiddleware(userRegisterDto), userRegister);

export default UserController;
