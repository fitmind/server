import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import adminLoginDto from './admin-login/admin-login-dto';
import adminLogin from './admin-login/admin-login';
import adminLogout from './admin-logout/admin-logout';
import adminExpertsPending from './admin-experts-pending/admin-experts-pending';
import adminAuthMiddleware from '../../middleware/admin-auth-middleware/admin-auth-middleware';
import AdminGetExpertById from './admin-expert-by-id/admin-expert-by-id';
import adminExpertApprove from './admin-expert-approve/admin-expert-approve';
import adminExpertApproveDto from './admin-expert-approve/admin-expert-approve-dto';

const adminRouter = express.Router();

adminRouter.post('/login', typeValidationMiddleware(adminLoginDto), adminLogin);
adminRouter.post('/logout', adminLogout);
adminRouter.get('/expert/pending', adminAuthMiddleware, adminExpertsPending);
adminRouter.get('/expert/:expertId', adminAuthMiddleware, AdminGetExpertById);
adminRouter.put(
  '/expert/approve/:expertId',
  adminAuthMiddleware,
  typeValidationMiddleware(adminExpertApproveDto),
  adminExpertApprove
);

export default adminRouter;
