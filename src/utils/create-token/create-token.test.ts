import createUserToken from './create-token';

describe('create token', () => {
  it('should return the id embedded as a json web token', () => {
    const token = createUserToken('12345');
    console.log(token.length);
    expect(token.length).toEqual(151);
  });
});
