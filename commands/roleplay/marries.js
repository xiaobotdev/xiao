const { Command } = require('discord.js-commando');

module.exports = class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'marry',
            group: 'roleplay',
            memberName: 'marry',
            description: 'Marries someone. (;marry @User)',
            examples: [';marry @User'],
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
        const thingToRoleplay = args.thing;
        return message.say(`${message.author} *marries* ${thingToRoleplay}`);
    }
};
