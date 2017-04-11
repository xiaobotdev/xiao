const { Command } = require('discord.js-commando');

module.exports = class ReverseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text (;reverse This text please)',
            examples: [';reverse This text please'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to reverse?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const text = args.text;
        const reversed = text.split('').reverse().join('');
        return message.say(`\u180E${reversed}`);
    }
};
