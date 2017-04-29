const { Command } = require('discord.js-commando');
const { letterTrans } = require('custom-translate');
const dictionary = require('./morsemappings');

module.exports = class MorseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'morse',
            group: 'textedit',
            memberName: 'morse',
            description: 'Translates text to morse code.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to convert to morse?',
                type: 'string',
                validate: text => {
                    if (letterTrans(text, dictionary, ' ').length < 1999)
                        return true;
                    return 'Your message content is too long.';
                },
                parse: text => letterTrans(text.toLowerCase(), dictionary, ' ')
            }]
        });
    }

    run(message, args) {
        const { text } = args;
        return message.say(text);
    }
};
