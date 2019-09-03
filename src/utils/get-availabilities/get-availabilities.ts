import WeeklyAvailability from '../../interfaces/weeklyAvailability.interface';

export const roundToTheNearestHour = (date: Date): Date => {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60) + 1);
  date.setMinutes(0);
  return date;
};

export const setNextDate = (date: number, counter: number): Date => {
  let newDate = new Date();
  newDate.setTime(date);
  newDate.setMinutes(newDate.getMinutes() + 30 * counter);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const generateDatesInTheNextMonth = () => {
  const now = new Date();
  const rounded = roundToTheNearestHour(now);
  let dates = [rounded];
  for (let i = 1; i < 1440; i++) {
    dates.push(setNextDate(rounded.getTime(), i));
  }
  return dates;
};

const daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const options = { hour: '2-digit', minute: '2-digit', hour12: false };

export const getAvailabilities = (weeklyAvailability: WeeklyAvailability, futureBookings?: Date[]) => {
  const nextMonthDates = generateDatesInTheNextMonth();
  const result = nextMonthDates.filter(date => {
    const day = daysArray[date.getDay()];
    // @ts-ignore
    const availabilityForTheDay: string[] = weeklyAvailability[day];
    const dateTime = date.toLocaleTimeString('default', options);
    // if there are future bookings - I need to not pass the future dates that are in that list
    if (futureBookings) {
      const mapped = futureBookings.map(d => d.getTime());
      if (mapped.includes(date.getTime())) return false;
    }
    // if the current date being looped is in the non available list, return false in this filter func
    if (availabilityForTheDay.includes(dateTime)) return false;
    else return true;
  });
  return result;
};
