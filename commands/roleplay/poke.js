const { Command } = require('discord.js-commando');

module.exports = class PokeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poke',
            group: 'roleplay',
            memberName: 'poke',
            description: 'Pokes someone. (x;poke @User)',
            examples: ['x;poke @User'],
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
        return message.say(`${message.author} *pokes* ${thing}`);
    }
};
