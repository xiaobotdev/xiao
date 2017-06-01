const Command = require('../../structures/Command');

module.exports = class ReverseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reverse',
            group: 'textedit',
            memberName: 'reverse',
            description: 'Reverses text.',
            args: [
                {
                    key: 'text',
                    prompt: 'What text would you like to reverse?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { text } = args;
        const converted = text.split('').reverse().join('');
        return msg.say(`\u180E${converted}`);
    }
};
