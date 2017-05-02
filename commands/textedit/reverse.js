const { Command } = require('discord.js-commando');

module.exports = class ReverseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to reverse?',
                    type: 'string',
                    parse: text => text.split('').reverse().join('')
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(`\u180E${text}`);
    }
};
