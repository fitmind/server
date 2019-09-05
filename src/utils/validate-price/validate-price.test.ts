import { ValidPrice } from './validate-price';

describe('validate price', () => {
  const validPrice = new ValidPrice();
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
      const validation = validPrice.validate('true', validationArguments);
      expect(validation).toBeFalsy();
    });

    it('should return true if no value is passed', () => {
      const validation = validPrice.validate(undefined, validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return true if page is bigger than 0', () => {
      const validation = validPrice.validate('5', validationArguments);
      expect(validation).toBeTruthy();
    });

    it('should return false if value is smaller 0', () => {
      const validation = validPrice.validate('-1', validationArguments);
      expect(validation).toBeFalsy();
    });
    it('should return false if value is bigger than 4000', () => {
      const validation = validPrice.validate('4001', validationArguments);
      expect(validation).toBeFalsy();
    });
  });

  describe('default message function', () => {
    it('should return the validation message', () => {
      expect(validPrice.defaultMessage(validationArguments)).toEqual(
        'Price must be a positive value between 0 and 4000'
      );
    });
  });
});
