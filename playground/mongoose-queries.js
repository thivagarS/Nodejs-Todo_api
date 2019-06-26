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

// Find - returns array of documents matching req criteria n returns empty array [] if nothing is found
// no need of ObjectID constructor mongoose will automatically convert
Todo.find({
    _id: id
}).then( docs => {
    if(!docs.length > 0)
        return console.log('No result');
    console.log(JSON.stringify(docs, undefined, 2));
});

// FindOne - return doc matching first n return an object not as an array n returns null if nothing is found
// Prefer while finding only one record
Todo.findOne({
    _id: id
}).then( doc => {
    if(!doc)
        return console.log('No result');
    console.log(JSON.stringify(doc, undefined, 2));
});

// FindById - return doc matching the ID n returns null if nothing is found
Todo.findById({
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