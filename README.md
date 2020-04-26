Backend server for the SmartBrain application. 

The server is built with Node/Express js and communicates with a Postgresql database (storing user login information) via the Knex npm package.

It handles basic endpoints like:

/register - POST request that accepts user information and if successful will update the database with the new user.

/signin - POST request that accepts user login information and checks the database for mathcing credentials. User passwords are stored and compared using bcryptjs.

/image - PUT request that increments the given user's entry count.

The front end repository for the SmartBrain application is named SmartBrain-FrontEnd. 

