const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            group: 'userinfo',
            memberName: 'avatar',
            description: 'Gives a link to someone\'s avatar. (x;avatar @User)',
            examples: ['x;avatar @XiaoBot'],
            args: [{
                key: 'user',
                prompt: 'Which user would you like to get the avatar of?',
                type: 'user'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const { user } = args;
        return message.say(user.displayAvatarURL);
    }
};
