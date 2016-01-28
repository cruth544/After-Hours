module.exports = {
    mongo: {
        dev: {
            conn: process.env.DEV_CONN_STRING
        },
        prod: {
            conn: "mongodb://washburn.michael@gmail.com:abc123@ds051665.mongolab.com:51665/heroku_h1907377"
        },
        options:{
            server: {
                socketOptions: { keepAlive: 1 }
            }
        }
    }
};
