import { availableHours } from './available-hours';

export enum expertise {
  PERSONAL_COACH = 'PERSONAL_COACH',
  YOGA_COACH = 'YOGA_COACH',
  NUTRITIONIST = 'NUTRITIONIST',
  LIFE_COACH = 'LIFE_COACH'
}

export enum UserTypes {
  CUSTOMER = 'CUSTOMER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN'
}

export enum ApprovedStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DENIED = 'DENIED'
}

const CONFIG = {
  authTokenExpiryDate: 10000000000000,
  cookies: {
    user: 'X-Fitmind-Authorization',
    expert: 'X-Fitmind-Expert-Authorization',
    admin: 'X-Fitmind-Admin-Authorization'
  },
  modelNames: {
    expert: 'Expert',
    user: 'User',
    admin: 'Admin',
    listing: 'Listing',
    booking: 'Booking'
  },
  expertise,
  UserTypes,
  ApprovedStatus,
  availableHours,
  routes: {
    user: {
      signUp: '/user/register',
      login: '/user/login',
      me: '/user/me',
      logout: '/user/logout',
      dashboard: '/user/dashboard'
    },
    expert: {
      register: '/expert/register',
      login: '/expert/login',
      me: '/expert/me',
      logout: '/expert/logout',
      dashboard: '/expert/dashboard'
    },
    admin: {
      login: '/admin/login',
      logout: '/admin/logout',
      expertsPending: '/admin/expert/pending',
      listingsPending: '/admin/listing/pending',
      expertId: (id: string) => `/admin/expert/${id}`,
      listingId: (id: string) => `/admin/listing/${id}`,
      approveExpertId: (id: string) => `/admin/expert/approve/${id}`,
      approveListingId: (id: string) => `/admin/listing/approve/${id}`
    },
    listing: {
      new: '/listings/new',
      getListings: (query: string) => `/listings?${query}`,
      getById: (id: string) => `/listings/${id}`,
      getAvailabilityById: (id: string) => `/listings/availability/${id}`,
      deleteById: (id: string) => `/listings/${id}`,
      updateById: (id: string) => `/listings/${id}`
    },
    bookings: {
      new: (id: string) => `/bookings/new/${id}`,
      getAsCustomerById: (id: string) => `/bookings/user/${id}`,
      deleteAsCustomerById: (id: string) => `/bookings/user/${id}`,
      deleteAsExpertById: (id: string) => `/bookings/expert/${id}`,
      getAsExpertById: (id: string) => `/bookings/expert/${id}`
    }
  },
  emailSource: 'hello.fitmind@gmail.com',
  defaultBookingPopulate: [
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
  ]
};

export default CONFIG;
