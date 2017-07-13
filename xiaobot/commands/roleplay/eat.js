const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class EatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'eat',
            group: 'roleplay',
            memberName: 'eat',
            description: 'Eats a user.',
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
            **${msg.author.username}** *eats* **${user.username}**
            https://i.imgur.com/O7FQ5kz.gif
        `);
    }
};
