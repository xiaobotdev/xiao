const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'userinfo',
            memberName: 'avatar',
            description: 'Gives a link to a user\'s avatar.',
            args: [{
                key: 'user',
                prompt: 'Which user would you like to get the avatar of?',
                type: 'user'
            }]
        });
    }

    run(msg, args) {
        const { user } = args;
        return msg.say(user.avatarURL('png', 2048) || user.displayAvatarURL);
    }
};
