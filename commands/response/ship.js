const { Command } = require('discord.js-commando');

module.exports = class ShipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ship',
            aliases: [
                'rate'
            ],
            group: 'response',
            memberName: 'ship',
            description: 'Ships two people. (;ship @Rem and @Nate)',
            examples: [';ship @Rem and @Nate'],
            args: [{
                key: 'things',
                prompt: 'What do you want to ship together?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { things } = args;
        const percentage = Math.floor(Math.random() * 100) + 1;
        return message.say(`I'd give ${things} a ${percentage}%!`);
    }
};
