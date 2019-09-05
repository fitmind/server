import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'ValidPageNumber', async: false })
export class ValidPageNumber implements ValidatorConstraintInterface {
  public validate(page: any, args: ValidationArguments) {
    if (!page) {
      return true;
    }
    if (isNaN(page)) {
      return false;
    }
    const pageNumber = parseInt(page);
    return pageNumber > 0;
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Page number must be a number bigger than 0';
  }
}
