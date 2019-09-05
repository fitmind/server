import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'ValidSize', async: false })
export class ValidSize implements ValidatorConstraintInterface {
  public validate(size: any, args: ValidationArguments) {
    if (!size) {
      return true;
    }
    if (isNaN(size)) {
      return false;
    }
    const limit = parseInt(size);
    return !!(limit > 1 && limit < 21);
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Size must be a value between 1 and 20';
  }
}
