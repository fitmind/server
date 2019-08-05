import { ValidExpertise } from './validateExpertise';
import CONFIG from '../config/config';

describe('validate expertise', () => {
  const validExpertise = new ValidExpertise();
  const validationArguments = {
    value: '',
    constraints: [''],
    target: '',
    object: {},
    property: '',
    targetName: ''
  };

  describe('validate function', () => {
    it('should return false if no expertises are passed', () => {
      const validation = validExpertise.validate([''], validationArguments);
      expect(validation).toBeFalsy();
    });
    it('should only allow the valid expertise set in config to be passed', () => {
      const validExpertises = Object.keys(CONFIG.expertise);
      const validation = validExpertise.validate(validExpertises, validationArguments);
      expect(validation).toBeTruthy();
    });
    it('should return false if any other string is passed down', () => {
      const validation = validExpertise.validate(['string', 'more string'], validationArguments);
      expect(validation).toBeFalsy();
    });
  });

  describe('default message function', () => {
    it('should return the validation message', () => {
      expect(validExpertise.defaultMessage(validationArguments)).toEqual(
        'Expertise sent is not one of the valid ones and is necessary to send at least one'
      );
    });
  });
});
