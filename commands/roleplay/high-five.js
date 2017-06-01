const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class HighFivesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'high-five',
            group: 'roleplay',
            memberName: 'high-five',
            description: 'High Fives something/someone.',
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
            **${msg.author.username}** *high-fives* **${user.username}**
            https://i.imgur.com/7BJ6gfM.gif
        `);
    }
};
