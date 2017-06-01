const Sequelize = require('sequelize');
const { DATABASE_URL } = process.env;
const database = new Sequelize(DATABASE_URL, { logging: false });

class Database {
    static get db() {
        return database;
    }

    static start() {
        database.authenticate()
            .then(() => console.log('[DATABASE] Connection has been established successfully.'))
            .then(() => console.log('[DATABASE] Synchronizing...'))
            .then(() => database.sync()
                .then(() => console.log('[DATABASE] Synchronizing complete!'))
                .catch((err) => console.error(`[DATABASE] Error synchronizing: ${err}`))
            )
            .then(() => console.log('[DATABASE] Ready!'))
            .catch((err) => console.error(`[DATABASE] Unable to connect: ${err}`));
    }
}

module.exports = Database;
