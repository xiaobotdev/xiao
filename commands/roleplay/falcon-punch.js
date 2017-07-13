const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class FalconPunchCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'falcon-punch',
            group: 'roleplay',
            memberName: 'falcon-punch',
            description: 'Falcon Punches a user.',
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
            **${msg.author.username}** *falcon punches* **${user.username}**
            https://i.imgur.com/LOuK637.gif
        `);
    }
};
