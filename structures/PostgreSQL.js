const Sequelize = require('sequelize');
const database = new Sequelize(process.env.DATABASE_URL, { logging: false });

class Database {
	static get db() {
		return database;
	}

	start() {
		database.authenticate()
			.then(() => console.log('[Database] Connection has been established successfully.'))
			.then(() => console.log('[Database] Synchronizing...'))
			.then(() => database.sync()
				.then(() => console.log('[Database] Synchronizing complete!'))
				.catch(err => console.error(`[Database] Error synchronizing: ${err}`))
			)
			.then(() => console.log('[Database] Ready!'))
			.catch(err => console.error(`[Database] Unable to connect: ${err}`));
	}
}

module.exports = Database;
