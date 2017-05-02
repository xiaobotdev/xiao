const { Command } = require('discord.js-commando');
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
                    validate: text => {
                        if (text.length < 500) {
                            return true;
                        }
                        return `Please keep your text under 500 characters, you have ${text.length}.`;
                    },
                    parse: text => zalgo(text)
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        return msg.say(`\u180E${text}`);
    }
};
