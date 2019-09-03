import { ValidAvailability } from './validate-availability';

describe('validate availability', () => {
  const validExpertise = new ValidAvailability();
  const validationArguments = {
    value: '',
    constraints: [''],
    target: '',
    object: {},
    property: '',
    targetName: ''
  };

  describe('validate function', () => {
    it('should return true if all the hours in the dates are valid', () => {
      const monday = ['08:00', '09:00', '10:00'];
      const tuesday = ['08:00', '07:00', '08:00', '09:00'];
      const wednesday = ['06:00', '07:00', '08:00', '09:00'];
      const thursday = ['08:00', '16:00', '17:00', '18:00', '19:00'];
      const friday = ['08:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
      const saturday = ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'];
      const sunday = ['08:00'];
      const valid = {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
      };
      expect(validExpertise.validate(valid, validationArguments)).toBeTruthy();
    });
    describe('is invalid', () => {
      it('should return false when any of the values coming in is not a valid time', () => {
        const invalid = {
          monday: [10, '12:00'],
          tuesday: ['10:00', '12:00'],
          wednesday: ['10:00', '12:00'],
          thursday: ['10:00', '12:00'],
          friday: ['10:00', '12:00'],
          saturday: ['10:00', '12:00'],
          sunday: ['10:00', '12:00']
        };
        // @ts-ignore
        expect(validExpertise.validate(invalid, validationArguments)).toBeFalsy();
        const invalid2 = {
          monday: ['10:00', '12:00'],
          tuesday: ['10:00', '12:00'],
          wednesday: ['10:00', '12:00'],
          thursday: ['10:00', '12:00'],
          friday: ['10:00', '12:00'],
          saturday: ['10:00', '12:00'],
          sunday: ['10:00', '14']
        };
        expect(validExpertise.validate(invalid2, validationArguments)).toBeFalsy();
      });
      it('should return false when any of the days is missing', () => {
        const invalid = {
          monday: ['10:00', '12:00'],
          saturday: ['10:00', '12:00'],
          sunday: ['10:00', '12:00']
        };
        // @ts-ignore
        expect(validExpertise.validate(invalid, validationArguments)).toBeFalsy();
      });
      it('should return false when it receives any other field that is not a valid day', () => {
        const invalid = {
          monday: ['10:00', '12:00'],
          fakeDay: ['19:00'],
          saturday: ['10:00', '12:00'],
          sunday: ['10:00', '12:00']
        };
        // @ts-ignore
        expect(validExpertise.validate(invalid, validationArguments)).toBeFalsy();
      });
    });
  });
});
