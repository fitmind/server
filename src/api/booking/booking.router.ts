import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userAuthMiddleware from '../../middleware/user-auth-middleware/user-auth-middleware';
import createBookingDto from './create-booking/create-booking-dto';
import createBooking from './create-booking/create-booking';
import userGetBooking from './user-get-booking/user-get-booking';
import expertGetBooking from './expert-get-booking/expert-get-booking';
import expertAuthMiddleware from '../../middleware/expert-auth-middleware/expert-auth-middleware';

const bookingRouter = express.Router();

bookingRouter.post('/new/:listingId', userAuthMiddleware, typeValidationMiddleware(createBookingDto), createBooking);
bookingRouter.get('/user/:bookingId', userAuthMiddleware, userGetBooking);
bookingRouter.get('/expert/:bookingId', expertAuthMiddleware, expertGetBooking);

export default bookingRouter;
