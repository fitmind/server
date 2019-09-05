import CONFIG from '../../config/config';
import { ValidExpertiseGetListings } from './validate-expertise-get-listings';

describe('validate expertise get listings', () => {
  const validExpertise = new ValidExpertiseGetListings();
  const validationArguments = {
    value: '',
    constraints: [''],
    target: '',
    object: {},
    property: '',
    targetName: ''
  };

  describe('validate function', () => {
    it('should return true if no expertises are passed', () => {
      const validation = validExpertise.validate(undefined, validationArguments);
      expect(validation).toBeTruthy();
    });
    it('should only allow the valid expertise set in config to be passed', () => {
      const validation = validExpertise.validate(CONFIG.expertise.LIFE_COACH, validationArguments);
      expect(validation).toBeTruthy();
    });
    it('should return false if any other string is passed down', () => {
      const validation = validExpertise.validate('diego', validationArguments);
      expect(validation).toBeFalsy();
    });
  });

  describe('default message function', () => {
    it('should return the validation message', () => {
      expect(validExpertise.defaultMessage(validationArguments)).toEqual('Expertise sent is not valid');
    });
  });
});
