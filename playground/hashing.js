const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
    id: 123
} 

const token = jwt.sign(data, "playground");
console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJpYXQiOjE1NjE3ODgyMzJ9.0BGUgZgnOt3PraIWVg82sGZpbeHN-WVe7QtKxOWHXs8

const decoded = jwt.verify(token, 'playground');
console.log('decoded : ', decoded);
// decoded - return object which has id n issued at time -- payload
// return signature error when data is modified



/*
    Parts of hased JWT token which is separated with '.' from the return result jwt.sign
    1 ) Header - algothrim n token type
    2 ) Payload - data(id n issued at time)
    3 ) verify signature
*/

// JWT - Json web token -- using SHA256
// Standard for JWT 

/* const data = {
    id : '12345dddf'
};

const token = {
    data,
    hash: SHA256(JSON.stringify(data) + "playground").toString()
}

// token.data.id = 5;

const resultHash = SHA256(JSON.stringify(token.data) + "playground").toString();

if(resultHash === token.hash)
    console.log('Data not modified');
else    
    console.log('Data modified ...');*/