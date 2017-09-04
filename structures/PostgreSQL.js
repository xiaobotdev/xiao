const Sequelize = require('sequelize');
const { DB_URL } = process.env;
const database = new Sequelize(DB_URL, { logging: false });

class Database {
	static get db() {
		return database;
	}

	static start() {
		database.authenticate()
			.then(() => console.log('[DATABASE] Connection established successfully.'))
			.then(() => console.log('[DATABASE] Synchronizing...'))
			.then(() => database.sync()
				.then(() => console.log('[DATABASE] Done Synchronizing!'))
				.catch(err => console.error(`[DATABASE] Error synchronizing: ${err}`))
			)
			.catch(err => {
				console.error(`[DATABASE] Unable to connect: ${err}`);
				console.error(`[DATABASE] Reconnecting in 5 seconds...`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database;
