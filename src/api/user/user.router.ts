import express from 'express';
import userRegister from './user-register/user-register';
import userRegisterDto from './user-register/user-register-dto';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userLogin from './user-login/user-login';
import userLoginDto from './user-login/user-login.dto';
import userAuthMiddleware from '../../middleware/user-auth-middleware/user-auth-middleware';
import getUserMe from './user-me/user-me';
import CONFIG from '../../config/config';
import userLogout from './user-logout/user-logout';

const userType = CONFIG.UserTypes.CUSTOMER;
const userRouter = express.Router();

userRouter.post('/register', typeValidationMiddleware(userRegisterDto), userRegister);
userRouter.post('/login', typeValidationMiddleware(userLoginDto), userLogin);
userRouter.get('/me', userAuthMiddleware(userType), getUserMe);
userRouter.post('/logout', userAuthMiddleware(userType), userLogout);

export default userRouter;
