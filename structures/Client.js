const { CommandoClient } = require('discord.js-commando');
const Database = require('./PostgreSQL');

class XiaoClient extends CommandoClient {
	constructor(options) {
		super(options);
		this.database = Database.db;

		Database.start();
	}
}

module.exports = XiaoClient;
