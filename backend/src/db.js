const mysql = require("mysql");

class Database {
    // The database connection
    static #connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    // Connect to the database
    static Connect() {
        return new Promise((res, rej) => {
            this.#connection.connect((err) => {
                if (err) rej(err);
                else {
                    console.log("Connected to database!");
                    res();
                }
            });
        });
    }

    // Make a query to the database
    static Query(code, data=[]) {
        return new Promise((res, rej) => {
            this.#connection.query(code, data, (err, result) => {
                if (err) rej(err);
                else res(result);
            });
        });
    }
}

module.exports = Database;
