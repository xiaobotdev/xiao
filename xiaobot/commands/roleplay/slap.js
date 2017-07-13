const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slap',
            group: 'roleplay',
            memberName: 'slap',
            description: 'Slaps a user.',
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
            **${msg.author.username}** *slaps* **${user.username}**
            https://i.imgur.com/rfy8z2K.gif
        `);
    }
};
