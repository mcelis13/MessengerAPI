const authenticationController = require('../controllers/authentication');

describe('upperCaseNames', () => {
  //initial set up of my integration test...
  //right now failing because it does not have a req.params.id passed to it
  it('should return first and last name upper cased', () => {
    const result = authenticationController.upperCaseNames('madeline');
    expect(result).toBe('Madeline');
  });

  let request = {_id: 1, firstName: 'Max', lastName:'Miller', email:'maxmiller@gmail.com', password: 'af353gafg34', role:'Member'}
  it('setUserInfo', () => {
    const result = authenticationController.setUserInfo(request);
    expect(result).toMatchObject({_id: 1, firstName: 'Max', lastName:'Miller', email:'maxmiller@gmail.com'});
  });
});