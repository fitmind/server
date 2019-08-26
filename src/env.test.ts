describe('.env', () => {
  it('should have a port', () => {
    expect(process.env['PORT']).toBeDefined();
  });
  it('should have a MONGO_URL', () => {
    expect(process.env['MONGO_URL']).toBeDefined();
  });
  it('should have a AWS_ACCESS_KEY_ID', () => {
    expect(process.env['AWS_ACCESS_KEY_ID']).toBeDefined();
  });
  it('should have a AWS_SECRET_ACCESS_KEY', () => {
    expect(process.env['AWS_SECRET_ACCESS_KEY']).toBeDefined();
  });
  it('should have a MONGO_TESTING_URL', () => {
    expect(process.env['MONGO_TESTING_URL']).toBeDefined();
  });
  it('should have a NODE_ENV', () => {
    expect(process.env['NODE_ENV']).toBeDefined();
  });

  it('should have a JWT_SECRET', () => {
    expect(process.env['JWT_SECRET']).toBeDefined();
  });

  it('should have a CLIENT_ORIGIN', () => {
    expect(process.env['CLIENT_ORIGIN']).toBeDefined();
  });

  it('should have a ADMIN_EMAIL', () => {
    expect(process.env['ADMIN_EMAIL']).toBeDefined();
  });

  it('should have a ADMIN_PASSWORD', () => {
    expect(process.env['ADMIN_PASSWORD']).toBeDefined();
  });
});
