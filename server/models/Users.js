const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// To schema we can add 
    // 1 ) instance method -> this are called on the seperate doc (custom method n overriding a method )
    // 2 ) model method -> called on the model (like Users.findById)
// we cannot add the custom method r model method to the model 

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate : {
            validator : validator.isEmail,// = validator : (value) => {return validator.isEmail(value)}'
            message : `{VALUE} is not a valid email`
        }
    },
    password : {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be of 6 characters"]
    },

    // Common strucutre for token
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Model Method
UserSchema.statics.findByToken = function(token) {
    // This this keyword now points to the whole collection
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })

        return Promise.reject(); // same as above
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;
    return User.findOne({email}).then(user => {
        if(!user)
            return new Promise.reject();
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    resolve(user);
                } else {
                    reject();
                }
            })
        });
    })
}

// Mongoose middleware
UserSchema.pre('save', function(next) {
    // THis will exe only if password is modified once hashed password will get hashed again if any one of the value get modified
    const user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });      
    } else {
        next();
    }
})

// This will execute before something saved

// THis method by default will return the whole object as string . Now by overriding we will return the required username n id
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['email', '_id'])
}

// Use regular fn instead of arrow fn since we need to use this
UserSchema.methods.getAuthToken = function() {
    const user = this;
    const access = "auth";
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_TOKEN);
    // if push not working use user.token.concat([{access,token}])
    user.tokens.push({access, token});

    // using this type chaining this return will give a success value to the next then call
    return user.save().then(() => {
        return token;
    })
};

UserSchema.methods.deleteToken = function(token) {
    const user = this;
    // Pull will remove every element from the array matching as a whole tokens including token n access
    return user.update({
        $pull : {
            tokens : {token}
        }
    })
}

const Users = mongoose.model('Users', UserSchema);


module.exports = {Users};