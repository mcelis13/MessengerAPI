const authenticationFuncs = require('./authenticationFuncs.js');

describe('upperCaseNames', () => {
  //initial set up of my integration test...
  //right now failing because it does not have a req.params.id passed to it
  it('should return first and last name upper cased', () => {
    const result = authenticationFuncs.upperCaseNames('madeline');
    expect(result).toBe('Madeline');
  });
});

describe('setUserInfo', () => {

  let request = {_id: 1, firstName: 'Max', lastName:'Miller', email:'maxmiller@gmail.com', password: 'af353gafg34', role:'Member'}
  it('should return an object with id, firstName, lastName, and email', () => {
    const result = authenticationFuncs.setUserInfo(request)
    expect(result).toMatchObject({_id: 1, firstName: 'Max', lastName:'Miller', email:'maxmiller@gmail.com'});
  });
});

describe('generateToken', () => {
  it('should return a user object jwt jwt_secret_key', () => {
    authenticationFuncs.setUserInfo = jest.fn().mockReturnValue({_id: 1, firstName: 'a', lastName:'b', email:'c', password: '6', role:'m'});

    const result = authenticationFuncs.generateToken(authenticationFuncs.setUserInfo());
    const tokenLength = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImZpcnN0TmFtZSI6ImEiLCJsYXN0TmFtZSI6ImIiLCJlbWFpbCI6ImMiLCJwYXNzd29yZCI6IjYiLCJyb2xlIjoibSIsImlhdCI6MTU0NDQyMDIzOX0.IUrjoy14pnc1nOkljVsba-HFUGpXy-J7mmQKUdXyA2A'.length;
    expect(result).toHaveLength(tokenLength);
  });
});
