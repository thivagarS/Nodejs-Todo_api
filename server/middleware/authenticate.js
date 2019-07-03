const {Users} = require('./../models/Users');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    Users.findByToken(token).then(user => {
        if(!user)
            return Promise.reject(); // = res.status(401).send()
        req.user = user;
        req.token = token;
        next();
    }).catch(err => {
        res.status(401).send()
    })
}

module.exports = {authenticate}