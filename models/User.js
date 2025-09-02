const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    //made password not-unique in case we use github
    password: {
        type: String,
        minlength: 5,
    },
    githubId: {
        type: String,
        unique: true
    }
});

//hashing password, exiting if there's no password
userSchema.pre('save', async function (next) {
    if (!this.password) {
        next();
        return;
    }
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

//validating password, exiting if there's no password
userSchema.methods.isCorrectPassword = async function (password) {
    if (!this.password) {
        return;
    }
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);
module.exports = User;