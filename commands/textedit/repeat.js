const { Command } = require('discord.js-commando');

module.exports = class RepeatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'repeat',
            group: 'textedit',
            memberName: 'repeat',
            description: 'Repeat something over and over and over and over (etc).',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to repeat over and over and over and over?',
                    type: 'string',
                    parse: text => text.repeat(2000).substr(0, 1999)
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(`\u180E${text}`);
    }
};
