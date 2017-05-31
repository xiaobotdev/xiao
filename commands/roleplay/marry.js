const Command = require('../../structures/Command');

module.exports = class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'marry',
            group: 'roleplay',
            memberName: 'marry',
            description: 'Marries something/someone.',
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
        return msg.say(`${msg.author} *marries* ${thing}`);
    }
};
