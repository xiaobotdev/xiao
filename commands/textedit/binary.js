const { Command } = require('discord.js-commando');
const stringToBinary = require('string-to-binary');

module.exports = class BinaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'binary',
            group: 'textedit',
            memberName: 'binary',
            description: 'Converts text to binary. (;binary This text)',
            examples: [';binary This text'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to binary?',
                type: 'string',
                validate: content => {
                    if (stringToBinary(content).length > 1950) {
                        return 'Your message content is too long.';
                    }
                    return true;
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const text = args.text;
        const binary = stringToBinary(text);
        return message.say(binary);
    }
};
