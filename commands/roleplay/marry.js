const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'marry',
            group: 'roleplay',
            memberName: 'marry',
            description: 'Marries a user.',
            args: [
                {
                    key: 'user',
                    prompt: 'What user do you want to roleplay with?',
                    type: 'user'
                }
            ]
        });
    }

    run(msg, args) {
        const { user } = args;
        return msg.say(stripIndents`
            **${msg.author.username}** *marries* **${user.username}**
            https://i.imgur.com/u67QLhB.gif
        `);
    }
};
