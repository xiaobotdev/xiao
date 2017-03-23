const commando = require('discord.js-commando');

module.exports = class CanYouNot extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'canyounot',
            group: 'random',
            memberName: 'canyounot',
            description: 'Can YOU not? (;canyounot)',
            examples: [';canyounot']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log(`[Command] ${message.content}`);
        return message.channel.send('Can YOU not?');
    }
};
