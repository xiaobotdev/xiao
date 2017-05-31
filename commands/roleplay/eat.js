const Command = require('../../structures/Command');

module.exports = class EatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eat',
            group: 'roleplay',
            memberName: 'eat',
            description: 'Eats something/someone.',
            args: [
                {
                    key: 'thing',
                    prompt: 'What do you want to roleplay with?',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, args) {
        const { thing } = args;
        return msg.say(`${msg.author} *eats* ${thing}`);
    }
};
