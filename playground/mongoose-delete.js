const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {Users} = require('./../server/models/Users');

// Find an document using identifers
const id = '5d1273d60af59209cc763ab3';

// Validation to check whether ID is in correct format like valid format
// Object.isValid is prefered one or we can also use catch methond on then calls to handle
if(ObjectID.isValid(id))
    console.log('Object ID valid');
else
    console.log('Object ID is not valid');

// remove - it will remove all the documents . we must pass empty object {} -- to delete all docs
Todo.remove({}).then(todo => {
    console.log(todo);
})

// findOneAndRemove - it will find the first match and it will remove n also return the deleted doc 
Todo.findOneAndRemove({
    _id: id
}).then( doc => {
    if(!doc)
        return console.log('No result');
    console.log(JSON.stringify(doc, undefined, 2));
});

// findByIdAndRemove - it will find the first match and it will remove n also return the deleted doc 
Todo.findByIdAndRemove({
    _id: id
}).then( doc => {
    if(!doc)
        return console.log('No result');
    console.log(JSON.stringify(doc, undefined, 2));
})
.catch(err => {
    // Not prefered
    console.log('Object is not valid ', err);
})