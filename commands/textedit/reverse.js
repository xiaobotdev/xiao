const { Command } = require('discord.js-commando');

module.exports = class ReverseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to reverse?',
                type: 'string',
                parse: text => text.split('').reverse().join('')
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { text } = args;
        return message.say(`\u180E${text}`);
    }
};
