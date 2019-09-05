import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'ValidPrice', async: false })
export class ValidPrice implements ValidatorConstraintInterface {
  public validate(price: any, args: ValidationArguments) {
    if (!price) {
      return true;
    }
    if (isNaN(price)) {
      return false;
    }
    const priceParsed = parseInt(price);
    return !!(priceParsed > 0 && priceParsed < 4001);
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Price must be a positive value between 0 and 4000';
  }
}
