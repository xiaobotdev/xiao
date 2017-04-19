const { Command } = require('discord.js-commando');
const translator = require('custom-translate');
const { dictionary } = require('./udmappings.json');

module.exports = class UpsideDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upsidedown',
            aliases: [
                'upside-down',
                'udown'
            ],
            group: 'textedit',
            memberName: 'upsidedown',
            description: 'Flips text upside-down. (;upsidedown It\'s upside-down!)',
            examples: [';upsidedown It\'s upside-down!'],
            args: [{
                key: 'text',
                prompt: 'What text would you like to flip upside-down?',
                type: 'string',
                parse: text => {
                    return translator.letterTrans(text, dictionary);
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { text } = args;
        return message.say(text);
    }
};
