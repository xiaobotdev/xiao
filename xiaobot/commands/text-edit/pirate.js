const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/pirate');

module.exports = class PirateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pirate',
            group: 'text-edit',
            memberName: 'pirate',
            description: 'Converts text to pirate.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to pirate?',
                    type: 'string',
                    validate: (text) => {
                        if (wordTrans(text, dictionary).length < 1999) return true;
                        else return 'Your text is too long.';
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = wordTrans(text, dictionary);
        return msg.say(`\u180E${converted}`);
    }
};
