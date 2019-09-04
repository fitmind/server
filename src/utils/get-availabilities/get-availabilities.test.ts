import {
  generateDatesInTheNextMonth,
  getAvailabilities,
  roundToTheNearestHour,
  setNextDate
} from './get-availabilities';
import { validWeeklyAvailability } from '../testing-utils/testing-utils';

describe('roundToTheNearestHour', () => {
  it('should receive a date and round it to the next hour', () => {
    const date = new Date();
    const rounded = roundToTheNearestHour(date);
    expect(rounded.getMinutes()).toEqual(0);
  });
});

describe('setNextDate', () => {
  it('should return the next date by increasing it by an hour', () => {
    const epochDate = new Date(0);
    const increased: Date = setNextDate(epochDate.getTime(), 1);
    expect(increased.getHours()).toEqual(epochDate.getHours() + 1);
    const increasedTwice: Date = setNextDate(0, 2);
    expect(increasedTwice.getHours()).toEqual(epochDate.getHours() + 2);
  });
});

describe('generateDatesInTheNextMonth', () => {
  it('should return an array with all the dates per every hour for the next month', () => {
    const dates = generateDatesInTheNextMonth();
    expect(dates).toHaveLength(720);
    expect(typeof dates[0].getMonth).toEqual('function');
    expect(typeof dates[719].getMonth).toEqual('function');
  });
});

describe('getAvailabilities', () => {
  const noFutureBookings = getAvailabilities(validWeeklyAvailability);
  const noFutureBookingsLength = noFutureBookings.length;
  expect(noFutureBookingsLength < 720).toBeTruthy();

  const now = new Date();
  const rounded = roundToTheNearestHour(now);
  let futureBookings = [];
  for (let i = 1; i < 20; i++) {
    futureBookings.push(setNextDate(rounded.getTime(), i));
  }

  const withFutureBookings = getAvailabilities(validWeeklyAvailability, futureBookings);
  expect(withFutureBookings.length < noFutureBookingsLength).toBeTruthy();

  // need to check that none of the future bookings are in this list
  const mapped = futureBookings.map(d => d.getTime());
  const checkIfIncludesFutureBookings = withFutureBookings.filter(date => mapped.includes(date.getTime()));
  expect(checkIfIncludesFutureBookings).toHaveLength(0);
});
