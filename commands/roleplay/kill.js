const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class KillCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kill',
            group: 'roleplay',
            memberName: 'kill',
            description: 'Kills a user.',
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
            **${msg.author.username}** *kills* **${user.username}**
            https://i.imgur.com/WxD4XMe.gif
        `);
    }
};
