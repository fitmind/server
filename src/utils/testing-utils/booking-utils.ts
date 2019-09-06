import BookingModel, { BookingModelType } from '../../api/booking/booking.model';

const generateDateTomorrow = () => {
  const dateTomorrow = new Date();
  dateTomorrow.setMinutes(dateTomorrow.getMinutes() + 1440);
  return dateTomorrow;
};

export const generateDateYesterday = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 1440);
  return date;
};

export const generateBookingForTesting = async (
  userId: string,
  listingId: string,
  expertId: string,
  time: Date = generateDateTomorrow()
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

export const getBookingById = async (id: string) => {
  return BookingModel.findById(id);
};
