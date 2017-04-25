const { Command } = require('discord.js-commando');
const { letterTrans } = require('custom-translate');
const dictionary = require('./udmappings');

module.exports = class UpsideDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upsidedown',
            aliases: [
                'udown'
            ],
            group: 'textedit',
            memberName: 'upsidedown',
            description: 'Flips text upside-down.',
            args: [{
                key: 'text',
                prompt: 'What text would you like to flip upside-down?',
                type: 'string',
                parse: text => letterTrans(text, dictionary)
            }]
        });
    }

    run(message, args) {
        const { text } = args;
        return message.say(text);
    }
};
