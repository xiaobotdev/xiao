const Command = require('../../structures/Command');
const { wordTrans } = require('custom-translate');
const dictionary = require('../../assets/json/temmie');

module.exports = class TemmieCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'temmie',
            group: 'textedit',
            memberName: 'temmie',
            description: 'Translate text to Temmie speak.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to Temmie speak?',
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
