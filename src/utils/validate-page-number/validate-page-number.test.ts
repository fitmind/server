import { ValidPageNumber } from './validate-page-number';

describe('validate page number', () => {
  const validPageNumber = new ValidPageNumber();
  const validationArguments = {
    value: '',
    constraints: [''],
    target: '',
    object: {},
    property: '',
    targetName: ''
  };

  describe('validate function', () => {
    it('should return false if any value that is not a number string is passed', () => {
      const validation = validPageNumber.validate('true', validationArguments);
      expect(validation).toBeFalsy();
    });

    it('should return true if no value is passed', () => {
      const validation = validPageNumber.validate(undefined, validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return true if page is bigger than 0', () => {
      const validation = validPageNumber.validate('5', validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return false if page is smaller 0', () => {
      const validation = validPageNumber.validate('-2', validationArguments);
      expect(validation).toBeFalsy();
    });
  });

  describe('default message function', () => {
    it('should return the validation message', () => {
      expect(validPageNumber.defaultMessage(validationArguments)).toEqual('Page number must be a number bigger than 0');
    });
  });
});
