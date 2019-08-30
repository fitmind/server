import express from 'express';
import typeValidationMiddleware from '../../middleware/type-validation-middleware/type-validation-middleware';
import userAuthMiddleware from '../../middleware/user-auth-middleware/user-auth-middleware';
import createBookingDto from './create-booking/create-booking-dto';
import createBooking from './create-booking/create-booking';

const bookingRouter = express.Router();

bookingRouter.post('/new/:listingId', userAuthMiddleware, typeValidationMiddleware(createBookingDto), createBooking);

export default bookingRouter;
