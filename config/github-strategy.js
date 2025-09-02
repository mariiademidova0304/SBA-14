require('dotenv').config();
const User = require('../models/User');
const { Strategy: GitHubStrategy } = require('passport-github2');
const passport = require('passport');

//Followed Bryan's code during class for this one
const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
}

passport.use(new GitHubStrategy(options, async (accessToken, refreshToken, profile, done)=>{
    try{
        let user = await User.findOne({githubId: profile.id})

        if(!user){
            await User.create({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails[0].value
            });
            user = await User.findOne({githubId: profile.id}).select('-githubId');
        }
        return done(null, user);
    }catch(error){
        done(error, false);
    }
}));

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id);
        done(null, user);
    }catch(error){
        return done(error, null);
    }
})