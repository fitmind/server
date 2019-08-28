import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import createListing from './create-listing/create-listing';
import createListingDto from './create-listing/create-listing-dto';
import expertAuthMiddleware from '../../middleware/expert-auth-middleware/expert-auth-middleware';

const listingRouter = express.Router();

listingRouter.post('/new', expertAuthMiddleware, typeValidationMiddleware(createListingDto), createListing);

export default listingRouter;
