import BookingModel, { BookingModelType } from '../../api/booking/booking.model';

export const generateBookingForTesting = async (
  userId: string,
  listingId: string,
  expertId: string,
  time: string = '2019-08-31T11:00:14.407Z'
) => {
  return (await BookingModel.create({
    time: time,
    customer: userId,
    listing: listingId,
    expert: expertId
  })) as BookingModelType;
};

export const deleteBookingById = async (id: string) => {
  await BookingModel.findByIdAndDelete(id);
};

export const getBookingByCustomerId = async (id: string) => {
  return (await BookingModel.findOne({ customer: id })) as BookingModelType;
};
