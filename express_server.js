const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bcrypt = require('bcrypt');

// ----------------------------------//
// MiddleWare
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// ----------------------------------//
// Helper functions

const { generateRandomString, userUrls, getUserByEmail,isUserValid, isStringValid } = require("./helpers");

//----------------------------------//
// Data

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "eeeeee" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "eeeeee" }
};

const users = { 
  "eeeeee": {
    id: "eeeeee", 
    email: "e@e.e",
    password: '$2b$10$QAkjtQlvSJY8KA1e.CaJT.9hatyoiGVApMpMJvWCLbHuoK.x.it1e'
  },
 "222222": {
    id: "222222", 
    email: "2@2.2", 
    password: '$2b$10$F/7ZvBBphqpkTqzNzAlXJ.YZoTxXD1OYbV9XDET0GZnq3p1pXkT2G'
  }
};

//----------------------------------//
// GET and POST requests

// 'get' the home page which displays all stored urls;
app.get("/urls", (req, res) => {

  const user = isUserValid(req.session.user_id, users);
  const urls = userUrls(req.session.user_id, urlDatabase);
  const templateVars = { user, urls };

  res.render("urls_index", templateVars);
});

// 'get' the 'add new url' page. 
// will error if attempted by non-registered user
app.get("/urls/new", (req, res) => {

  const user = isUserValid(req.session.user_id, users);

  if (!user) {
    res.redirect("/login");
    return;
  }
  
  if (user) {
    const templateVars = { user }
    res.render("urls_new", templateVars);
  }
});

// POST function for new url page: function adds given url into url database
// Will return error if attempted by non-registered user
app.post("/urls", (req, res) => {

  if (!isUserValid(req.session.user_id, users)) {
    res.statusCode = 403;
    res.end('You do not have access to this. Please login prior to creating new URL.') 
    return;
  }

  if (isUserValid(req.session.user_id, users)) {
    const newShortUrl = generateRandomString();
    const longURL = req.body.longURL;
    const userID = req.session.user_id;
    urlDatabase[newShortUrl] = { longURL, userID }; 

    res.redirect(`/urls/${newShortUrl}`);
  }

});

// 'get' the generated shortURL page. Page displays the short and long url.
// returns error if :id is not a valid id in my database
// returns errors if user is not logged in
// returns error if logged in user is not the creator of the url
app.get("/urls/:id", (req, res) => {

  const user = isUserValid(req.session.user_id, users);
  const urlInfo = urlDatabase[req.params.id];

  if (!urlInfo) {
    res.statusCode = 404;
    res.end('This tinyURL does not exist in database');
    return;
  }

  if (!user) {
    res.statusCode = 403;
    res.end('Please login, you do not have access to this page');
  }

  if (!(urlInfo.userID === user.id)) {
    res.statusCode = 403;
    res.end('Your account does not have access to this page');
    return;
  }

  if (urlInfo.userID === user.id) {
    const shortURL = req.params.id;
    const longURL = urlDatabase[req.params.id].longURL;
  
    const templateVars = { user, shortURL, longURL } 

    res.render("urls_show", templateVars);

  }

});

// Edit an existing url. 2 error handlers:
// 1) will error if user not found in database
// 2) will error if user is in database, but is not associated with the url
app.post("/urls/:id", (req, res) => {

  const user = isUserValid(req.session.user_id, users);
  const urlInfo = urlDatabase[req.params.id];

  if (!user) {
    res.redirect(`/login`);
    return;
  }

  if (!(user.id === urlInfo.userID)) {
    res.statusCode = 403;
    res.end('Please login, you do not have access to this page');
  }
    
  if (user.id === urlInfo.userID) {
    urlInfo.longURL = req.body.longURL;
    res.redirect(`/urls`);
  }

});

// Delete an existing url
// will error if attempted by 
app.post("/urls/:id/delete", (req, res) => {

  const user = isUserValid(req.session.user_id, users);
  const urlInfo = urlDatabase[req.params.id];

  if (!user) {
    res.redirect(`/login`);
    return;
  }

  if (!(user.id === urlInfo.userID)) {
    res.statusCode = 403;
    res.end('You do not have permission to do this.')
  } 

  if (user.id === urlInfo.userID) {
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);
  } 

});

// 'get' the given short url page which redirects the page to the longURL
// basically, the /urls/:shortURL has a href which directs to this page, which then uses
// this function to direct to the actual longURL page.
// This page should be accessable for all users, whether logged in or not
app.get("/u/:id", (req, res) => {

  if (!urlDatabase[req.params.id]) {
    res.statusCode = 404;
    res.end('Sorry, page not found. Please check the url given is valid');
    return;
  }
  if (urlDatabase[req.params.id]) {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  }

});

// 'get' page for login. Redirects to /urls if already logged in
app.get("/login", (req, res) => {

  const user = isUserValid(req.session.user_id, users);

  if (user) {
    res.redirect('/url');
    return;
  }

  if (!user) {
    const templateVars = { user };
    res.render("login", templateVars);
  }

});

// login POST function;
// 1) if email does not exist, return error
// 2) if password doesn't match password on file, return error
app.post("/login", (req, res) => {

  // Are you an existing user?
  const user = getUserByEmail(req.body.email, users);

  if (!user) {
    res.statusCode = 403;
    res.end('invalid login credentials');
    return;
  }

  const passwordEntry = req.body.password;
  const passwordStored = user.password;

  if (!bcrypt.compareSync(passwordEntry, passwordStored)) {
    res.statusCode = 404;
    res.end('invalid login credentials');
    return;
  }

  if (bcrypt.compareSync(passwordEntry, passwordStored)) {
    req.session.user_id = user.id;
    res.redirect('/urls');
  }

});

// logout POST function;

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect('/urls');
});

// 'get the register new user page:
// redirects to /url if user logged in already
app.get("/register", (req, res) => {

  const user = isUserValid(req.session.user_id, users);

  if (user) {
    res.redirect('/url');
    return;
  }

  if (!user) {
    const templateVars = { user };
    res.render("register",templateVars)
  }

});

// register POST function 
// has 2 error handling conditions:
// 1) if user exists
// 2) password not valid (has ' ' in string, or if field is empty)

app.post("/register", (req, res) => {

  const existingUser = getUserByEmail(req.body.email, users);
  const validEmail = isStringValid(req.body.email);
  const validPassword = isStringValid(req.body.password);

  console.log('valid email and password', validEmail, validPassword)

  if (existingUser) {
    res.statusCode = 404;
    res.end('email Already used. Please choose a new one.');
    return;
  }

  if (!(validEmail && validPassword)) {
    res.statusCode = 404;
    res.end('put in proper email and password');
    return;
  }
  if (validEmail && validPassword) {

    const id = generateRandomString();
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    users[id] = { id, email, password };

    req.session.user_id = id;
    res.redirect('/urls');
  }

});

app.get("/*", (req, res) => {
  isUserValid(req.session.user_id, users) ? res.redirect('/urls') : res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});