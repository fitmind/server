import ExpertInterface from './expert.interface';
import ListingInterface from './listing.interface';
import UserInterface from './user-interface';

interface Booking {
  time: Date;
  expert: ExpertInterface;
  listing: ListingInterface;
  customer: UserInterface;
}

export default Booking;
