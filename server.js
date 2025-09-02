require('dotenv').config();
require('./config/github-strategy');
const express = require('express');
const passport = require('passport');
const app = express();
const db = require('./config/connection');
const userRoutes = require('./routes/userRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');


const session = require('express-session');
app.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false
    })
)
app.use(passport.session());


app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoutes);
app.use('/', bookmarkRoutes);

const port = process.env.PORT || 3000;

db.once('open', () => {
    app.listen(port, () => console.log(`🌍Server is running at http://localhost:${port}`));
});