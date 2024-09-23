require('dotenv').config();
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    connectionLimit: 5
});

module.exports = {
    async connect() {
        let conn;
        try {
            conn = await pool.getConnection();
            console.log('Connected to database');

            const rows = await conn.query("SELECT * FROM servers");
            console.log(rows);
            return conn;
        } catch (err) {
            console.log('Error connecting to database: ' + err);
        }
    }
}
