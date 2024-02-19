const config = require("config");
const morgan = require ("morgan");

module.exports = function(app) {
    //check if private key is set. but only if not in development mode
    console.log("the environment is " + app.get('env'));
    if(app.get('env') !== 'development') {
        if(!config.get("jwtPrivateKey")) {
            throw new Error("FATAL ERROR: jwtPrivateKey is not defined.")//if we throw an error we can see the stacktrace later.
            
            //Alternative:
            //console.error("FATAL ERROR: jwtPrivateKey is not defined.");
            //process.exit(1);
        }
    }
    //Configuration
    console.log('NODE_ENV is: '+ process.env.NODE_ENV);
    console.log('Application Name: ' + config.get('name'));//accesses the json files in ./config depending on NODE_ENV matching the filename
    console.log('Mail Server: ' + config.get('mail.host'));
    /* //the Password must be set in environment variable specified in ./custom-environment-variables
    //choose unique name for environment variable to not overwrite existing.
    try {
        console.log('Mail Password: ' + config.get('mail.password'));
    } catch (error) {
        debug("No Password. (" + error + ")");
        debugTest("This is a Test.");
    }
    */

    //Is only executed in development mode
    //another option is 'process.env.NODE_ENV' that would return 'undefined'
    //When undefined app.get('env') returns development
    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        console.log('morgan enabled...');
        
    }
}