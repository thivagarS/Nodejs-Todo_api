require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {Users} = require('./models/Users');
const {authenticate} = require('./middleware/authenticate');

const app = express();

// Middleware Setup
// For parsing JSON to Object send through request

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo.save().then(todo => {
        res.send(todo);
    }).catch (err => {
        res.status(400).send(err);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(todos => {
        res.send({todos});
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

app.get('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    else {
        Todo.findOne({
            _id: id,
            _creator: req.user._id
    }).then(todo => {
            if(!todo)
                res.status(404).send();
            else
                res.send({todo});
        })
        .catch(err => {
            res.status(400).send();
        })
    }
});

app.delete('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    else {
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then(todo => {
            if(!todo)
                res.status(404).send();
            else
                res.status(200).send({todo});
        })
        .catch(err => {
            res.status(400).send();
        })
    }
});

app.patch('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    // THis utility is used to pick the required value from the json file as user might send the object property which is not there 
        // n like completed At value which is system generated.
    const body = _.pick(req.body, ["text", "completed"]);
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    else {
        if(_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completedAt = null;
            body.completed = false;
        }
        // new : true will return the update doc
        Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, {$set: body}, {new: true}).then(todo => {
            if(!todo)
                res.status(404).send();
            else
                res.send({todo});
        })
    }
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new Users({
        email: body.email, 
        password: body.password
    });

    // Normally this save will call a internal method toJSON n return the object 
    // since user is not allowed to get password n token returned to the response we have override the method to return the required value
    user.save().then(user => {
        return user.getAuthToken();
    })
    .then((token) => {
        res.header('x-auth', token).send(user);
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

app.get('/users/me', authenticate , (req, res) => {
    res.send(req.user);
});

app.get('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    Users.findByCredentials(body.email, body.password).then(user => {
        return user.getAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    })
    .catch(err => {
        res.status(400).send(err);
    })
});
 
app.delete('/users/me/token', authenticate, (req, res) => {
    try {
        req.user.deleteToken(req.token).then(() => {
            res.status(200).send();
        })
        .catch(err => {
            res.status(401).send();
        })
    } catch {
        res.status(401).send();
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App started ... Listening on port ${process.env.PORT}`);
});