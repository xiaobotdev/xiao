const { Command } = require('discord.js-commando');

module.exports = class CanYouNotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'canyounot',
            group: 'random',
            memberName: 'canyounot',
            description: 'Can YOU not? (;canyounot)',
            examples: [';canyounot']
        });
    }

    run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        return message.say('Can YOU not?');
    }
};
