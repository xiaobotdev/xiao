const commando = require('discord.js-commando');

module.exports = class AvatarCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'avatar',
            group: 'userinfo',
            memberName: 'avatar',
            description: "Gives a link to someone's avatar. (;avatar @User)",
            examples: [";avatar @XiaoBot"]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        if (message.mentions.users.size !== 1) {
            message.channel.send(':x: Error! Please mention one user!');
        }
        else {
            if (!message.mentions.users.first().avatarURL) {
                message.channel.send(":x: Error! This person has no avatar!");
            }
            else {
                message.channel.send(message.mentions.users.first().avatarURL);
            }
        }
    }
};
