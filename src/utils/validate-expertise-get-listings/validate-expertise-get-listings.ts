import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import CONFIG from '../../config/config';

@ValidatorConstraint({ name: 'ValidExpertiseGetListings', async: false })
export class ValidExpertiseGetListings implements ValidatorConstraintInterface {
  public validate(expertise: string | undefined, args: ValidationArguments) {
    if (!expertise) {
      return true;
    }
    const allowedExpertises = Object.values(CONFIG.expertise);
    return allowedExpertises.includes(expertise);
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Expertise sent is not valid';
  }
}
