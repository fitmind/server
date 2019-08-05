import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import CONFIG from '../config/config';

@ValidatorConstraint({ name: 'validExpertise', async: false })
export class ValidExpertise implements ValidatorConstraintInterface {
  public validate(expertises: string[], args: ValidationArguments) {
    if (!expertises) {
      return false;
    }
    let valid = true;
    const allowedExpertises = Object.values(CONFIG.expertise);
    for (let i = 0; i < expertises.length; i++) {
      if (!allowedExpertises.includes(expertises[i])) {
        valid = false;
      }
    }
    return valid;
  }

  public defaultMessage(args: ValidationArguments) {
    return 'Expertise sent is not one of the valid ones and is necessary to send at least one';
  }
}
