import BookingModel from '../../api/booking/booking.model';

const defaultPopulate = [
  'id',
  'name',
  'pictureUrl',
  'description',
  'approvedStatus',
  'createdTimeStamp',
  'email',
  'price',
  'expertiseArea',
  'postCode'
];

const getBookingDefaultReturn = async (bookingId: string) => {
  return BookingModel.findById(bookingId)
    .populate({
      path: 'customer',
      select: defaultPopulate
    })
    .populate({
      path: 'listing',
      select: defaultPopulate
    })
    .populate({
      path: 'expert',
      select: defaultPopulate
    });
};

export default getBookingDefaultReturn;
