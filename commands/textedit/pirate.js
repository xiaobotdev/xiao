const { Command } = require('discord.js-commando');
const translator = require('custom-translate');
const { dictionary } = require('./piratewords.json');

module.exports = class PirateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pirate',
            aliases: [
                'piratespeak',
                'yarr'
            ],
            group: 'textedit',
            memberName: 'pirate',
            description: 'Talk like a pirate! (x;pirate This is being said like a pirate!)',
            examples: ['x;pirate This is being said like a pirate!'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to pirate?',
                type: 'string',
                validate: content => {
                    if (translator.wordTrans(content, dictionary).length < 1999) {
                        return true;
                    }
                    return 'Your message content is too long.';
                },
                parse: text => {
                    return translator.wordTrans(text, dictionary);
                }
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
