import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import createListing from './create-listing/create-listing';
import createListingDto from './create-listing/create-listing-dto';
import expertAuthMiddleware from '../../middleware/expert-auth-middleware/expert-auth-middleware';
import getListingById from './get-listing-by-id/get-listing-by-id';
import deleteListingById from './delete-listing-by-id/delete-listing-by-id';
import updateListingById from './update-listing-by-id/update-listing-by-id';
import updateListingDto from './update-listing-by-id/update-listing-by-id-dto';
import getListingAvailabilities from './get-listing-availabilities/get-listing-availabilities';
import getListings from './get-listings/get-listings';
import queryParamsValidationMiddleware from '../../middleware/query-param-validation-middleware/query-param-validation-middleware';
import getListingsDto from './get-listings/get-listings-dto';

const listingRouter = express.Router();

listingRouter.post('/new', expertAuthMiddleware, typeValidationMiddleware(createListingDto), createListing);
listingRouter.get('/:id', getListingById);
listingRouter.get('/', queryParamsValidationMiddleware(getListingsDto), getListings);
listingRouter.get('/availability/:id', getListingAvailabilities);
listingRouter.delete('/:id', expertAuthMiddleware, deleteListingById);
listingRouter.put('/:id', expertAuthMiddleware, typeValidationMiddleware(updateListingDto), updateListingById);

export default listingRouter;
