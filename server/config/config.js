var env = process.env.NODE_ENV || "development";
// NODE_ENV for test is set to npm start test or test-watch
if(env === 'development' || env === 'test') {
    const configObject = require('./config.json');
    const processObject = configObject[env];
    Object.keys(processObject).forEach(key => {
        process.env[Key] = processObject[key];
    });
}
