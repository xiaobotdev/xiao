const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pat',
            group: 'roleplay',
            memberName: 'pat',
            description: 'Pats a user.',
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
            **${msg.author.username}** *pats* **${user.username}**
            https://i.imgur.com/oynHZmT.gif
        `);
    }
};
