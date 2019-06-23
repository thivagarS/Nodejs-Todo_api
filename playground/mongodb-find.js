const {MongoClient, ObjectID} = require('mongodb');

(async () => {
    const dbURL = `mongodb://localhost:27017/TodoApp`;
    try {
        const client = await MongoClient.connect(dbURL, {useNewUrlParser : true});
        const db = client.db('TodoApp');
        const TodosCollection = db.collection('Todos');
        // find operation will return a cursor we have perform lot of operation on the cursor check offical doc -- http://mongodb.github.io/node-mongodb-native/3.1/api/
        // find will return a promise
        // find without params
        console.log('Find method without Parameters')
        TodosCollection.find().toArray().then((docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }).catch(err => {
            console.log(`Error while fetching the data \n ${err}`)
        })
        // find with filter n count cursor method using await
        const count = await TodosCollection.find({completed : true}).count();
        console.log(`Number of completed Todo is ${count}`);
        // find an document using object ID , use ObjectID constructor bcoz the ID is a ObjectID is not a string it is reference Object ID
        // find ({_id : `5d08fbc1efb6f50cec1d1a59`}) ---- Wrong
        const doc = await TodosCollection.find({
            _id : new ObjectID(`5d08fbc1efb6f50cec1d1a59`)
        }).toArray();
        console.log(`I  fetched using ObjectID Constructor ${JSON.stringify(doc[0], undefined, 2)}`);
        client.close()
    } catch (err) {
        if(err)
            console.log(`DB error \n ${err}`);
    }
    
})()