const expect = require('expect');
const fireEmailAuthentication = require('./../../src/firebase/emailAuthentication');

const testUser = {
  email:'test_create@test.com',
  password: 'password'
};

before('should create a new user', (done) => {
  const fireEmailAuth = new fireEmailAuthentication(testUser.email, testUser.password);
  fireEmailAuth.signIn().then(user => {
    user.delete();
    done();
  }).catch(err => done());
});

describe('Fire Authentication', () => {

  it('should authenticate user and run callback', (done) => {
    let didRunCallback = false;
    const user = {
      email:'georgesitoniv@gmail.com',
      password: 'password'
    };
    const successCallback = () => {
      didRunCallback = true;
    };
    const fireEmailAuth = new fireEmailAuthentication(user.email, user.password);
    fireEmailAuth.signInAndRunCallbacks().then(authUser => {
      expect(authUser.email).toBe(user.email);
      expect(didRunCallback).toBe(false);
      done();
    }).catch(err => done(err));
  });

  it('should create a new user and run callbacks', (done) => {
    let didRunCallback = false;
    const successCallback = () => {
      didRunCallback = true;
    };
    const fireEmailAuth = new fireEmailAuthentication(
      testUser.email, testUser.password, successCallback
    );
    fireEmailAuth.createUserAndRunCallbacks().then(authUser => {
      expect(authUser.email).toBe(testUser.email);
      expect(didRunCallback).toBe(true);
      done();
    }).catch(err => done(err));
  });

});