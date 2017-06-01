const Command = require('../../structures/Command');
const zalgo = require('zalgolize');

module.exports = class ZalgoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'zalgo',
            group: 'textedit',
            memberName: 'zalgo',
            description: 'Zalgoizes Text.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to convert to zalgo?',
                    type: 'string',
                    validate: (text) => {
                        if (text.length < 500) return true;
                        else return 'Invalid Text. Text must be under 500 characters.';
                    }
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = zalgo(text);
        return msg.say(`\u180E${converted}`);
    }
};
