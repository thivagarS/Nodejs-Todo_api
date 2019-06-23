// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// TO manually use ID
const id = new ObjectID();
console.log(`id : ${id}`);

(async () => {
    const url = `mongodb://localhost:27017/TodoApp`; // TodoApp -- database it will create autoatically if we insert some data
    try {
        const client = await MongoClient.connect(url, {useNewUrlParser : true});
        console.log("Connected to MongoDB ...");

        const db = client.db("TodoApp"); // creating database reference

        db.collection("Todos").insertOne({
            // we can manually set _id also __id : 123
            text : "Something to do",
            completed : false
        }, (err, result) => {
            if(err)
                return console.log("Unable to insert data ", err)
            console.log(JSON.stringify(result.ops, undefined, 2));
            // object id (generated automaticaaly) is 12 bit made up of time stamp, machine id, process id n counter ---> replaces primary key
            console.log(`ID : ${result.ops[0]._id} , Time stamp : ${result.ops[0]._id.getTimestamp()}`);
        })
        client.close();
    } catch(error) {
        console.log(error);
        console.log("Unable to connect to Mongo DB");
    }
})()
