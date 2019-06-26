const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {Users} = require('./models/Users');

const app = express();

// Middleware Setup

// For parsing JSON to Object send through request
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then(doc => {
        res.send(doc);
    }).catch (err => {
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then(doc => {
        res.send({doc});
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
        Todo.findById(id).then(doc => {
            if(!doc)
                res.status(404).send();
            else
                res.send({doc});
        })
        .catch(err => {
            res.status(400).send();
        })
    }
});

app.listen(8080, () => {
    console.log(`App started ... Listening on port 8080 `);
})