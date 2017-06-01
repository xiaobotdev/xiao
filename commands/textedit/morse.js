const Command = require('../../structures/Command');
const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/morse');

module.exports = class MorseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'morse',
            group: 'textedit',
            memberName: 'morse',
            description: 'Translates text to morse code.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to morse?',
                    type: 'string',
                    validate: (text) => {
                        if (letterTrans(text, dictionary, ' ').length < 1999) return true;
                        else return 'Your text is too long.';
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = letterTrans(text.toLowerCase(), dictionary, ' ');
        return msg.say(converted);
    }
};
