module.exports = {
    mongo: {
        dev: {
            conn: process.env.DEV_CONN_STRING
        },
        prod: {
            conn: process.env.PROD_CONN_STRING
        },
        options:{
            server: {
                socketOptions: { keepAlive: 1 }
            }
        }
    }
};
