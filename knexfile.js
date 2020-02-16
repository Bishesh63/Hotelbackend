const path = require("path");
module.exports = {
    client: "mysql",
    connection:{
        host:"localhost",
        user: "root",
        password:"",
        database:"HotelBookingSystem"
    },
    migrations:{
        tablename: "migrations",
        directory: path.resolve(__dirname, "./migrations")
    },
    useNullAsDefault: true
};