const { Client } = require('discord.js-commando');
const Database = require('./PostgreSQL');

class CommandoClient extends Client {
    constructor(options) {
        super(options);

        this.database = Database.db;

        Database.start();
    }
}

module.exports = CommandoClient;
