const { Command } = require('discord.js-commando');
const { letterTrans } = require('custom-translate');
const dictionary = require('./udmappings');

module.exports = class UpsideDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upside-down',
            aliases: [
                'udown'
            ],
            group: 'textedit',
            memberName: 'upside-down',
            description: 'Flips text upside-down.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to flip upside-down?',
                    type: 'string',
                    parse: text => letterTrans(text, dictionary)
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(text);
    }
};
