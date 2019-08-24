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

const userRouter = express.Router();

userRouter.post('/register', typeValidationMiddleware(userRegisterDto), userRegister);
userRouter.post('/login', typeValidationMiddleware(userLoginDto), userLogin);
userRouter.get('/me', userAuthMiddleware, getUserMe);
userRouter.put('/me', userAuthMiddleware, typeValidationMiddleware(userRegisterDto), updateUserMe);
userRouter.post('/logout', userAuthMiddleware, userLogout);

export default userRouter;
