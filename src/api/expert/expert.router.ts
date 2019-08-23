import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import expertRegisterDto from './expert-register/expert-register-dto';
import expertRegister from './expert-register/expert-register';
import expertLogin from './expert-login/expert-login';
import expertLoginDto from './expert-login/expert-login-dto';

const expertRouter = express.Router();

expertRouter.post('/register', typeValidationMiddleware(expertRegisterDto), expertRegister);
expertRouter.post('/login', typeValidationMiddleware(expertLoginDto), expertLogin);

export default expertRouter;
