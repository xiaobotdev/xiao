const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class HugCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            group: 'roleplay',
            memberName: 'hug',
            description: 'Hugs a user.',
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
            **${msg.author.username}** *hugs* **${user.username}**
            https://i.imgur.com/q9Wkhz4.gif
        `);
    }
};
