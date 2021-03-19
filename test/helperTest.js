const { assert } = require('chai');

const { getUserByEmail, generateRandomString, userUrls, isUserValid, isStringValid } = require('../helpers.js');

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "eeeeee" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "eeeeee" },
  eimLd2: { longURL: "https://www.bbc.com", userID: "eeeeee" },
  bdfav2: { longURL: "https://www.bbc.com", userID: "qqqqqq" },

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

describe('userUrls', function() {
  it('given a user_id that exists in database, outputs an object of all urls with associated user_id', function() {
    const actualOutput = userUrls('eeeeee', urlDatabase);
    expectedOutput = {
      b6UTxQ: "https://www.tsn.ca", 
      i3BoGr: "https://www.google.ca", 
      eimLd2: "https://www.bbc.com"
    };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("given a user_id that doesn't exist in database, outputs empty object", () => {
    const actualOutput = userUrls('123456', urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(actualOutput, expectedOutput);
  })
});

describe('isUserValid', function() {
  it('should return user info when given an existing user', function() {
    const actualOutput = isUserValid('eeeeee', users);
    expectedOutput = {
      id: "eeeeee", 
      email: "e@e.e",
      password: 'password1'
    };
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it('should return false when given user not found in database', () => {
    const actualOutput = isUserValid('qqqqqq', users);
    const expectedOutput = false;
    assert.equal(actualOutput, expectedOutput);
  })
});

describe('isStringValid', function() {
  it("should return true when string is not empty or has ' ' in it", function() {
    const actualOutput = isStringValid('eeeeee');
    assert.isTrue(actualOutput);
  });
  it("should return user false when string has ' ' in it", function() {
    const actualOutput = isStringValid('    daf  ss ');
    assert.isFalse(actualOutput);
  });
  it("should return user false when string is empty", function() {
    const actualOutput = isStringValid('');
    assert.isFalse(actualOutput);
  });
});