const { Client } = require('discord.js-commando');
const Database = require('./PostgreSQL');
const Cleverbot = require('cleverio');
const { CLEVS_KEY, CLEVS_USER, CLEVS_NICK } = process.env;

class CommandoClient extends Client {
    constructor(options) {
        super(options);
        this.database = Database.db;
        this.cleverbot = new Cleverbot({
            key: CLEVS_KEY,
            user: CLEVS_USER,
            nick: CLEVS_NICK
        });
        
        Database.start();
        this.cleverbot.create();
    }
    
    get mentionRegex() {
        return new RegExp(`<!?@${this.user.id}>`, 'g');
    }
}

module.exports = CommandoClient;
