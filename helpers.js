
// This function is used to generate IDs or shortURLS

const generateRandomString = () => {
  return Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
};

// This function is used to check whether an email given by user
// matches an email already stored in our database
// returns six digit user_id if match, false if no match found

const getUserByEmail = (email, database) => {

  let userInfo = false;
  for (const userId in database) {
    if (database[userId].email === email) {
      userInfo = database[userId];
    }
  }
  return userInfo;
};

// Function that filters the url Database and creates an object
// of URLS that match the given user_id,
// in the form of { shortURL: longURL } key value pairs.

const userUrls = (userId, database) => {
  const output = {};
  for (const url in database) {
    if (database[url].userID === userId) {
      output[url] = database[url].longURL;
    }
  }
  return output;
};

// Function that gets given a user ID, and returns the user info if valid,
// and returns false if wrong

const isUserValid = (userId, database) => {
  if (!database[userId]) {
    return false;
  }
  if (database[userId]) {
    return database[userId];
  }
};
// function that filters a given string and returns true if string doesnt meet error requirements;
const isStringValid = string => {

  if (!string.length) {
    return false;
  }
  if (string.includes(' ')) {
    return false;
  }
  return true;
};


module.exports = {generateRandomString, getUserByEmail, userUrls, isUserValid, isStringValid };