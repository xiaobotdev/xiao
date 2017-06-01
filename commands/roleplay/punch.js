const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class PunchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'punch',
            group: 'roleplay',
            memberName: 'punch',
            description: 'Punches a user.',
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
            **${msg.author.username}** *punches* **${user.username}**
            https://i.imgur.com/R5KBiYV.gif
        `);
    }
};
