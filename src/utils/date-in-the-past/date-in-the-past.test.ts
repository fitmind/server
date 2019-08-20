import { dateInThePast } from './date-in-the-past';

describe('booking utils', () => {
  describe('dateInThePast', () => {
    it('should return true if the date is in the past', () => {
      let pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(dateInThePast(pastDate)).toBeTruthy();
    });
  });
});
