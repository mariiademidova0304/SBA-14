This project is a secure backend Express application.
Users are able to login using their own credentials or through their github account. 

Project relies on these dependencies to be installed: express, mongoose, bcrypt, jsonwebtoken, dotenv, passport, and passport-github2

Project containes 2 models - User and Bookmark. Only logged in users can access bookmarks and only those belonging to them through interconnected User's _id.

Passport is set up to handle github authentication.

CRUD functionality is implemented for Bookmark routes.