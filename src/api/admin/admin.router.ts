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
import adminListingsPending from './admin-listings-pending/admin-listings-pending';
import adminGetListingById from './admin-listing-by-id/admin-listing-by-id';

const adminRouter = express.Router();

adminRouter.post('/login', typeValidationMiddleware(adminLoginDto), adminLogin);
adminRouter.post('/logout', adminLogout);
adminRouter.get('/expert/pending', adminAuthMiddleware, adminExpertsPending);
adminRouter.get('/listings/pending', adminAuthMiddleware, adminListingsPending);
adminRouter.get('/expert/:expertId', adminAuthMiddleware, AdminGetExpertById);
adminRouter.get('/listings/:id', adminAuthMiddleware, adminGetListingById);
adminRouter.put(
  '/expert/approve/:expertId',
  adminAuthMiddleware,
  typeValidationMiddleware(adminExpertApproveDto),
  adminExpertApprove
);

export default adminRouter;
