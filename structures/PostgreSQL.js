const Sequelize = require('sequelize');

const database = new Sequelize(process.env.DB_URL, { logging: false });

class Database {
	static get db() {
		return database;
	}

	start() {
		database.authenticate()
			.then(() => console.log('Connection to database has been established successfully.'))
			.then(() => console.log('Synchronizing database...'))
			.then(() => database.sync()
				.then(() => console.log('Synchronizing database done!'))
				.catch(error => console.error(`Error synchronizing the database: ${error}`))
			)
			.then(() => console.log('Ready to rock!'))
			.catch(err => console.error(`Unable to connect to the database: ${err}`));
	}
}

module.exports = Database;