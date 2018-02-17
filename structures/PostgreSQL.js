const Sequelize = require('sequelize');
const { DB_URL } = process.env;
const db = new Sequelize(DB_URL, { logging: false, operatorsAliases: false });

class PostgreSQL {
	static get db() {
		return db;
	}

	static async start() {
		try {
			await db.authenticate();
			console.log('[DATABASE] Connection established! Syncing...');
			await db.sync();
			console.log('[DATABASE] Database sync complete!');
		} catch (err) {
			console.error('[DATABASE] Unable to connect to database:', err);
			setTimeout(() => PostgreSQL.start(), 5000);
		}
	}
}

module.exports = PostgreSQL;
