import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import adminLoginDto from './admin-login/admin-login-dto';
import adminLogin from './admin-login/admin-login';

const adminRouter = express.Router();

adminRouter.post('/login', typeValidationMiddleware(adminLoginDto), adminLogin);

export default adminRouter;
