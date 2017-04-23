const { Command } = require('discord.js-commando');
const fortunes = require('./fortunes.json');

module.exports = class FortuneCookieCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fortune',
            aliases: [
                'fortunecookie'
            ],
            group: 'response',
            memberName: 'fortune',
            description: 'Fortune Cookie.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        return message.say(fortune);
    }
};
