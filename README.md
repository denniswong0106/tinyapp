# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

The homepage:
!["The homepage"](https://github.com/denniswong0106/tinyapp/blob/master/docs/homepage-no-login.png)

To access your urls, login first:
!["Login page"](https://github.com/denniswong0106/tinyapp/blob/master/docs/login.png)

If you don't have a login, you can register:
!["register page"](https://github.com/denniswong0106/tinyapp/blob/master/docs/create-account.png)

Excellent! Currently we don't have any urls. So let's start adding some!
!["homepage no urls"](https://github.com/denniswong0106/tinyapp/blob/master/docs/homepage-firstuser-nourls.png)

Adding a url:
!["create url"](https://github.com/denniswong0106/tinyapp/blob/master/docs/create-new-url.png)

Here is the created url!
!["created url"](https://github.com/denniswong0106/tinyapp/blob/master/docs/created-url.png)

Let's add a few more, and see what our homepage looks like now!
!["homepage with 3 urls"](https://github.com/denniswong0106/tinyapp/blob/master/docs/homepage-3url-bbc.png)

Let's try editing a url:
!["edit url"](https://github.com/denniswong0106/tinyapp/blob/master/docs/edit-url.png)

Let's take a look at our homepage again:
!["homepage with 3 urls changed"](https://github.com/denniswong0106/tinyapp/blob/master/docs/homepage-3urls-gmail.png)

What happens if we logout and another user logs in?
!["homepage another user"](https://github.com/denniswong0106/tinyapp/blob/master/docs/homepage-anotheruser.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.