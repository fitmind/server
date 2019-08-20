import { Response } from 'express';
import { OK } from 'http-status-codes';
import RequestWithUser from '../../../interfaces/request-with-user.interface';
import UserModel, { UserModelType } from '../user.model';
// import BookingModel from '../../bookings/booking.model';
// import filterUser from '../../../utils/filter-user/filter-user';

const userDashboard = async (req: RequestWithUser, res: Response) => {
  const reqUser = req.user as UserModelType;
  // todo: wont be able to properly finish the dashboard until I have crud for bookings and listings
  const user = await UserModel.findById(reqUser.id).populate({ path: 'bookings', populate: [{ path: 'listing' }] });
  console.log(user);
  res.status(OK).json({ ...user });
};

export default userDashboard;
