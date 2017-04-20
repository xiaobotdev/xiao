const { Command } = require('discord.js-commando');

module.exports = class OffspringCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'offspring',
            aliases: [
                'child',
                'baby'
            ],
            group: 'response',
            memberName: 'offspring',
            description: 'Tells you if your new child is a boy or a girl. (x;offspring)',
            examples: ['x;offspring']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        let gender = ['boy', 'girl'];
        gender = gender[Math.floor(Math.random() * gender.length)];
        return message.say(`It's a ${gender}!`);
    }
};
