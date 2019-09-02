import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userAuthMiddleware from '../../middleware/user-auth-middleware/user-auth-middleware';
import createBookingDto from './create-booking/create-booking-dto';
import createBooking from './create-booking/create-booking';
import userGetBooking from './user-get-booking/user-get-booking';
import expertGetBooking from './expert-get-booking/expert-get-booking';
import expertAuthMiddleware from '../../middleware/expert-auth-middleware/expert-auth-middleware';
import userDeleteBooking from './user-delete-booking/user-delete-booking';
import expertDeleteBooking from './expert-delete-booking/expert-delete-booking';

const bookingRouter = express.Router();

bookingRouter.post('/new/:listingId', userAuthMiddleware, typeValidationMiddleware(createBookingDto), createBooking);
bookingRouter.get('/user/:bookingId', userAuthMiddleware, userGetBooking);
bookingRouter.delete('/user/:bookingId', userAuthMiddleware, userDeleteBooking);
bookingRouter.get('/expert/:bookingId', expertAuthMiddleware, expertGetBooking);
bookingRouter.delete('/expert/:bookingId', expertAuthMiddleware, expertDeleteBooking);

export default bookingRouter;
