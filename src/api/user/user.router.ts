import express from 'express';
import userRegister from './user-register/user-register';
import userRegisterDto from './user-register/user-register-dto';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userLogin from './user-login/user-login';
import userLoginDto from './user-login/user-login.dto';
import userAuthMiddleware from '../../middleware/user-auth-middleware/user-auth-middleware';
import getUserMe from './user-me/user-me';
import userLogout from './user-logout/user-logout';
import updateUserMe from './user-update/user-update';
import userDashboard from './user-dashboard/user-dashboard';

const userRouter = express.Router();

export const userLoginMValidate = typeValidationMiddleware(userLoginDto);
export const userRegisterValidate = typeValidationMiddleware(userRegisterDto);

userRouter.post('/register', userRegisterValidate, userRegister);
userRouter.post('/login', userLoginMValidate, userLogin);
userRouter.get('/me', userAuthMiddleware, getUserMe);
userRouter.get('/dashboard', userAuthMiddleware, userDashboard);
userRouter.put('/me', userAuthMiddleware, userRegisterValidate, updateUserMe);
userRouter.post('/logout', userLogout);

export default userRouter;
