const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {Users} = require('./models/Users');

const app = express();

// Middleware Setup

// For parsing JSON to Object send through request
app.use(bodyParser.json());

app.post('/todo', (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then(doc => {
        res.send(doc);
    }).catch (err => {
        res.status(400).send(err);
    })
});
app.listen(8080, () => {
    console.log(`App atarted ... Listening on port 8080 `);
})