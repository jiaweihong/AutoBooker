const pool = require("pg").pool

const pool = new Pool({
    user: "postgres",
    password: "Hongjiawei17",
    host: "localhost",
    port: 5432,
    database: "autobooker_local_db"
})

module.exports = pool;