import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import expertRegisterDto from './expert-register/expert-register-dto';
import expertRegister from './expert-register/expert-register';

const expertRouter = express.Router();

expertRouter.post('/register', typeValidationMiddleware(expertRegisterDto), expertRegister);

export default expertRouter;
