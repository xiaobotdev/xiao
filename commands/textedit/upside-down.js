const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/upside-down');

module.exports = class UpsideDownCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'upside-down',
            aliases: ['udown'],
            group: 'textedit',
            memberName: 'upside-down',
            description: 'Flips text upside-down.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to flip upside-down?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = letterTrans(text, dictionary);
        return msg.say(converted);
    }
};
