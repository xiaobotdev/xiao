const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'divorce',
            group: 'roleplay',
            memberName: 'divorce',
            description: 'Divorces a user.',
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
            **${msg.author.username}** *divorces* **${user.username}**
            https://i.imgur.com/IgvLWaa.gif
        `);
    }
};
