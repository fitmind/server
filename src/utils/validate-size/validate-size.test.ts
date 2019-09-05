import { ValidSize } from './validate-size';

describe('validate size', () => {
  const validSize = new ValidSize();
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
      const validation = validSize.validate('true', validationArguments);
      expect(validation).toBeFalsy();
    });

    it('should return true if no value is passed', () => {
      const validation = validSize.validate(undefined, validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return true if page is bigger than 0', () => {
      const validation = validSize.validate('5', validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return false if value is smaller 0', () => {
      const validation = validSize.validate('-1', validationArguments);
      expect(validation).toBeFalsy();
    });
    it('should return false if value is bigger than 20', () => {
      const validation = validSize.validate('22', validationArguments);
      expect(validation).toBeFalsy();
    });
  });

  describe('default message function', () => {
    it('should return the validation message', () => {
      expect(validSize.defaultMessage(validationArguments)).toEqual('Size must be a value between 1 and 20');
    });
  });
});
