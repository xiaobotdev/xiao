const { Command } = require('discord.js-commando');
const fortunes = require('./fortunes');

module.exports = class FortuneCookieCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fortune',
            group: 'response',
            memberName: 'fortune',
            description: 'Fortune Cookie.'
        });
    }

    run(msg) {
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        return msg.say(fortune);
    }
};
