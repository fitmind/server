import {
  generateDatesInTheNextMonth,
  getAvailabilities,
  roundToTheNearestHour,
  setNextDate
} from './get-availabilities';

describe('roundToTheNearestHour', () => {
  it('should receive a date and round it to the next hour', () => {
    const date = new Date();
    const rounded = roundToTheNearestHour(date);
    expect(rounded.getMinutes()).toEqual(0);
  });
});

describe('setNextDate', () => {
  it('should return the next date by increasing it by half an hour', () => {
    const increased: Date = setNextDate(0, 1);
    expect(increased.getMinutes()).toEqual(30);
    const increasedTwice: Date = setNextDate(0, 2);
    expect(increasedTwice.getMinutes()).toEqual(0);
  });
});

describe('generateDatesInTheNextMonth', () => {
  it('should return an array with all the dates per every half an hour for the next month', () => {
    const dates = generateDatesInTheNextMonth();
    expect(dates).toHaveLength(1440);
    expect(typeof dates[0].getMonth).toEqual('function');
    expect(typeof dates[1439].getMonth).toEqual('function');
  });
});

describe('getAvailabilities', () => {
  const monday = ['08:00', '08:30', '09:00', '09:30', '10:00'];
  const tuesday = ['07:00', '07:30', '08:00', '08:30', '09:00'];
  const wednesday = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'];
  const thursday = [
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30'
  ];
  const friday = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];
  const saturday = [
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00'
  ];
  const sunday = ['00:30'];
  const weeklyAvailability = {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday
  };

  //   const weeklyArray = [
  //   monday.length,
  //   tuesday.length,
  //   wednesday.length,
  //   thursday.length,
  //   friday.length,
  //   saturday.length,
  //   sunday.length
  // ];
  // const numberOfWeeklyDates = weeklyArray.reduce((i, j) => i + j);

  const now = new Date();
  const rounded = roundToTheNearestHour(now);
  let futureBookings = [];
  for (let i = 1; i < 20; i++) {
    futureBookings.push(setNextDate(rounded.getTime(), i));
  }

  const noFutureBookings = getAvailabilities(weeklyAvailability);
  const noFutureBookingsLength = noFutureBookings.length;
  expect(noFutureBookingsLength < 1440).toBeTruthy();

  const withFutureBookings = getAvailabilities(weeklyAvailability, futureBookings);
  expect(withFutureBookings.length < noFutureBookingsLength).toBeTruthy();

  // need to check that none of the future bookings are in this list
  const mapped = futureBookings.map(d => d.getTime());
  const checkIfIncludesFutureBookings = withFutureBookings.filter(date => mapped.includes(date.getTime()));
  expect(checkIfIncludesFutureBookings).toHaveLength(0);
});
