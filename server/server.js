const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {Users} = require('./models/Users');

const app = express();
const port = process.env.PORT || 8080;
// Middleware Setup

// For parsing JSON to Object send through request
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then(todo => {
        res.send(todo);
    }).catch (err => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos});
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    else {
        Todo.findById(id).then(todo => {
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

app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send();
    else {
        Todo.findByIdAndRemove(id).then(todo => {
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

app.patch('/todo/:id', (req, res) => {
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
        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
            if(!todo)
                res.status(404).send();
            else
                res.send({todo});
        })
    }
});
app.listen(port, () => {
    console.log(`App started ... Listening on port ${port} `);
})