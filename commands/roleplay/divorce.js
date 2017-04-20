const { Command } = require('discord.js-commando');

module.exports = class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'divorce',
            group: 'roleplay',
            memberName: 'divorce',
            description: 'Divorces someone. (x;divorce @User)',
            examples: ['x;divorce @User'],
            args: [{
                key: 'thing',
                prompt: 'What do you want to roleplay with?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { thing } = args;
        return message.say(`${message.author} *divorces* ${thing}`);
    }
};
