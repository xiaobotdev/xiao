const { Command } = require('discord.js-commando');
const genders = ['boy', 'girl'];

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
            description: 'Tells you if your new child is a boy or a girl.'
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const gender = genders[Math.floor(Math.random() * genders.length)];
        return message.say(`It's a ${gender}!`);
    }
};
