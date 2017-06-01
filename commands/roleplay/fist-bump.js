const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class FistBumpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fist-bump',
            group: 'roleplay',
            memberName: 'fist-bump',
            description: 'Fistbumps a user.',
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
            **${msg.author.username}** *fist-bumps* **${user.username}**
            *badalalala* https://i.imgur.com/lO2xZHC.gif
        `);
    }
};
