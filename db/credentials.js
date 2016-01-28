module.exports = {
    mongo: {
        dev: {
            conn: process.env.DEV_CONN_STRING
        },
        prod: {
            conn: MONGOLAB_URI
        },
        options:{
            server: {
                socketOptions: { keepAlive: 1 }
            }
        }
    }
};
