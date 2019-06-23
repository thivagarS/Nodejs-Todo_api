const {MongoClient, ObjectID} = require('mongodb');

(async () => {
    const dbURL = `mongodb://localhost:27017/TodoApp`;
    try {
        const client = await MongoClient.connect(dbURL, {useNewUrlParser : true});
        const db = client.db('TodoApp');
        const TodosCollection = db.collection('Todos');
        // Deleting documents
        // 1 ) Delete Many - delete all the document matching the given criteria n it will return Result object with contains 
            // status(Ok) and  no of document deleted (n)
        TodosCollection.deleteMany({text : "Eat Lunch"}).then(result => {
            console.log(`Delete Many Result : \n ${result}`);
        })

        // 2 ) Deleteone - delete the first document matching the given criteria n return Result Object
        let result = await TodosCollection.deleteOne({text : "Eat Dinner"});
        console.log(`Delete One Result : \n ${result}`);

        // 3 ) FindOneAndDelete - delete the first document matching the given criteria n returns document which contains 
            // the document data n no of records deleted n last error object n status 
        result = await TodosCollection.findOneAndDelete({text : 'Eat Breakfast'});
        console.log(`Find One and Delete result \n ${JSON.stringify(result, undefined, 2)}`);
        
        client.close()
    } catch (err) {
        if(err)
            console.log(`DB error \n ${err}`);
    }
    
})()