const {MongoClient, ObjectID} = require('mongodb');

(async () => {
    const dbURL = `mongodb://localhost:27017/TodoApp`;
    try {
        const client = await MongoClient.connect(dbURL, {useNewUrlParser : true});
        const db = client.db('TodoApp');
        const TodosCollection = db.collection('Todos');
        // findOneandUpdate -- find one n updare -- by default it will return original document
        // Parameters - filter, update(update operators), options, callback (if not specified return promises)
        // Update Operator : $set - set value, $inc - increament the value by specified amount -- ref offical doc
        // Options parameter - here used to override the default return from return original to returning updated document
        const updatedDoc = await TodosCollection.findOneAndUpdate({text : "Walk the Dog"}, {$set : {
            completed : false
        }}, {returnOriginal : false});
        console.log(`Updated Doc : ${JSON.stringify(updatedDoc, undefined, 2)}`);
        client.close()
    } catch (err) {
        if(err)
            console.log(`DB error \n ${err}`);
    }
    
})()