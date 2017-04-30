const { Command } = require('discord.js-commando');
const { wordTrans } = require('custom-translate');
const dictionary = require('./piratewords');

module.exports = class PirateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pirate',
            group: 'textedit',
            memberName: 'pirate',
            description: 'Talk like a pirate!',
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to pirate?',
                type: 'string',
                validate: text => {
                    if (wordTrans(text, dictionary).length < 1999)
                        return true;
                    return 'Your message content is too long.';
                },
                parse: text => wordTrans(text, dictionary)
            }]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(`\u180E${text}`);
    }
};
