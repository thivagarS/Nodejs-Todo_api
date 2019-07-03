const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text : {
        // Here we can give lot of properties like type, required or not etc
        type: String,
        required: true,
        minlength: 1, 
        trim: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    completedAt : {
        type: Number,
        default: null
    },
    _creator : {
        type: mongoose.Schema.Types.ObjectId,
        required: true   
    }
});

module.exports = {Todo};