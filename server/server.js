const mongoose = require('mongoose');

// By default mongoose uses callback so to use Promise we have defined this line. We can set any Promise libaray to mongoose here default builtin promise
mongoose.Promise = global.Promise;
// This will connect to database here by default mongoose prevent the connect so need to define in callback fn like we did in mongo db
    // it also prevent the line from executing unless database connection is established
mongoose.connect('mongodb://localhost:27017/TodoApp');
// This will create a structured model
const Todo = mongoose.model('Todo', {
    text : {
        // Here we can give lot of properties like type, required or not etc
        type : String
    },
    completed : {
        type : Boolean
    },
    completedAt : {
        type: Number
    }
});

// This will create the object based on the reference
const newTodo = new Todo({
    text : "Feed the Cat",
    completed : false
});

// This will save the data to the database and it will return promise n return the document inserted
newTodo.save().then(doc => {
    console.log(`New Data inserted ${JSON.stringify(doc, undefined, 2)}`);
})
.catch(err => {
    console.log(`Error while inserting data ${err}`)
})

