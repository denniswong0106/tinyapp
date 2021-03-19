const { assert } = require('chai');

const { getUserByEmail, generateRandomString } = require('../helpers.js');

const users = { 
  "eeeeee": {
    id: "eeeeee", 
    email: "e@e.e",
    password: 'password1'
  },
 "222222": {
    id: "222222", 
    email: "2@2.2", 
    password: 'password2'
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("e@e.e", users);
    const expectedOutput = {
      id: "eeeeee", 
      email: "e@e.e",
      password: 'password1'
    };
    assert.deepEqual(user, expectedOutput);
  });
  it('should return false with an email not found in database', () => {
    const user = getUserByEmail("q@q.q", users);
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  })
});

describe('generateRandomString', function() {
  it('the generated value should be a string', function() {
    const actualOutput = typeof generateRandomString();
    expectedOutput = 'string';
    assert.equal(actualOutput, expectedOutput);
  });
  it('two strings seperately generated strings should not match', () => {
    const actualOutput = generateRandomString();
    const expectedOutput = false;
    assert.notEqual(actualOutput, expectedOutput);
  })
});

// describe('generateRandomString', function() {
//   it('the generated value should be a string', function() {
//     const actualOutput = typeof generateRandomString();
//     expectedOutput = 'string';
//     assert.deepEqual(actualOutput, expectedOutput);
//   });
//   it('two strings seperately generated strings should not match', () => {
//     const actualOutput = generateRandomString();
//     const expectedOutput = false;
//     assert.notEqual(actualOutput, expectedOutput);
//   })
// });