import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import adminLoginDto from './admin-login/admin-login-dto';
import adminLogin from './admin-login/admin-login';
import adminLogout from './admin-logout/admin-logout';

const adminRouter = express.Router();

adminRouter.post('/login', typeValidationMiddleware(adminLoginDto), adminLogin);
adminRouter.post('/logout', adminLogout);

export default adminRouter;
