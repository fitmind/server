import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import expertRegisterDto from './expert-register/expert-register-dto';
import expertRegister from './expert-register/expert-register';
import expertLogin from './expert-login/expert-login';
import expertLoginDto from './expert-login/expert-login-dto';
import expertLogout from './expert-logout/expert-logout';
import updateExpert from './expert-update/expert-update';
import expertUpdateDto from './expert-update/expert-update-dto';
import expertAuthMiddleware from '../../middleware/expert-auth-middleware/expert-auth-middleware';
import getExpertMe from './expert-me/expert-me';

const expertRouter = express.Router();

const expertRegisterValidation = typeValidationMiddleware(expertRegisterDto);
const expertLoginValidation = typeValidationMiddleware(expertLoginDto);
const expertUpdateValidation = typeValidationMiddleware(expertUpdateDto);

expertRouter.post('/register', expertRegisterValidation, expertRegister);
expertRouter.post('/login', expertLoginValidation, expertLogin);
expertRouter.post('/logout', expertLogout);
expertRouter.put('/me', expertAuthMiddleware, expertUpdateValidation, updateExpert);
expertRouter.get('/me', expertAuthMiddleware, getExpertMe);

export default expertRouter;
