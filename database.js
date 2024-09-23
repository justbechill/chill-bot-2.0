require('dotenv').config();
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    connectionLimit: 5
});

let conn;

module.exports = {
    async connect() {
        try {
            conn = await pool.getConnection();
        } catch (err) {
            console.log('Error connecting to database: ' + err);
        }
    },
    async getConfig() {
        let res;

        try {
            res = await conn.query("SELECT * FROM servers");
        } catch (err) {
            console.log('Error getting config: ' + err);
        }

        const rows = {};

        for (let row of res) {
            rows[row.id] = row;
        }

        return rows;
    },
    async getServer(id) {
        let res;

        try {
            res = await conn.query(`SELECT * FROM servers WHERE id = ${id}`);
        } catch (err) {
            console.log('Error getting config: ' + err);
        }

        return res[0];
    },
    async addServer(id) {

        try {
            await conn.query(`INSERT INTO servers (id) VALUES (${id})`);
            console.log('added server ' + id);
        } catch (err) {
            console.log('Error adding server: ' + err);
        }
    },
    async setServer(config) {
        let query = 'UPDATE servers SET '

        let i = 0;
        for (let key in config) {
            let isString = typeof config[key] === 'string';
            if(key == 'id' || config[key] == null) continue;
            if (i > 0) query += ', ';
            query += `${key}=${isString ? "'" : ""}${config[key]}${isString ? "'" : ""}`;

            i++;
        }
        query += ` WHERE id = ${config.id}`;

        console.log(query)

        try {
            await conn.query(query);
        } catch (err) {
            console.log('Error setting config: ' + err);
        }
    }
}
