describe('.env', () => {
  it('should have a port', () => {
    expect(process.env['PORT']).toBeDefined();
  });
  it('should have a MongoURL', () => {
    expect(process.env['mongoUrl']).toBeDefined();
  });
  it('should have a NODE_ENV', () => {
    expect(process.env['NODE_ENV']).toBeDefined();
  });
});
