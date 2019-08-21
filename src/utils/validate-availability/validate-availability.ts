import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import weeklyAvailability from '../../interfaces/weeklyAvailability.interface';
import { availableHours } from '../../config/available-hours';

type DayType = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
const daysAvailable = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

@ValidatorConstraint({ name: 'validExpertise', async: false })
export class ValidAvailability implements ValidatorConstraintInterface {
  public validate(weeklyAvailability: weeklyAvailability, args: ValidationArguments) {
    if (!weeklyAvailability) return false;

    const days = Object.keys(weeklyAvailability);
    if (days.length !== 7) return false;

    let result = true;

    days.forEach((day: string) => {
      if (!daysAvailable.includes(day)) {
        result = false;
      } else {
        const times = weeklyAvailability[day as DayType];
        times.forEach(time => {
          if (!availableHours.includes(time)) result = false;
        });
      }
    });
    return result;
  }

  public defaultMessage(args: ValidationArguments) {
    return 'All the days of the week need to be included and they can only be the available hours as a string';
  }
}
