const commando = require('discord.js-commando');

module.exports = class AvatarCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'avatar',
            group: 'userinfo',
            memberName: 'avatar',
            description: 'Gives a link to someone\'s avatar. (;avatar @User)',
            examples: [';avatar @XiaoBot'],
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
        console.log(`[Command] ${message.content}`);
        const user = args.user;
        return message.say(user.displayAvatarURL);
    }
};
