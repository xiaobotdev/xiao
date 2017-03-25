const commando = require('discord.js-commando');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UserInfoCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'user',
            aliases: [
                'userinfo',
                'member',
                'memberinfo'
            ],
            group: 'userinfo',
            memberName: 'user',
            description: "Gives some info on a user. (;user @User)",
            examples: [";user @User"],
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Which user would you like to get info on?',
                type: 'user'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let user = args.user;
        let stat;
        switch (user.presence.status) {
            case "online":
                stat = "<:vpOnline:212789758110334977> Online";
                break;
            case "idle":
                stat = "<:vpAway:212789859071426561> Idle";
                break;
            case "dnd":
                stat = "<:vpDnD:230093576355184640> Do Not Disturb";
                break;
            case "offline":
                stat = "<:vpOffline:212790005943369728> Offline";
                break;
        }
        let color;
        switch (user.presence.status) {
            case "online":
                color = 0x00AE86;
                break;
            case "idle":
                color = 0xFFFF00;
                break;
            case "dnd":
                color = 0xFF0000;
                break;
            case "offline":
                color = 0x808080;
                break;
        }
        let userGame;
        if (!user.presence.game) {
            userGame = "None";
        }
        else {
            userGame = user.presence.game.name;
        }
        const embed = new Discord.RichEmbed()
            .setColor(color)
            .setThumbnail(user.displayAvatarURL)
            .addField('**Name:**',
                `${user.username}#${user.discriminator}`, true)
            .addField('**ID:**',
                user.id, true)
            .addField('**Joined Discord On:**',
                `${user.createdAt}\n${moment.duration(Date.now() - user.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.`, true)
            .addField('**Joined Server On:**',
                `${message.guild.member(user).joinedAt}\n${moment.duration(Date.now() - message.guild.member(user).joinedTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.`, true)
            .addField('**Status:**',
                stat, true)
            .addField('**Playing:**',
                userGame, true);
        return message.embed(embed);
    }
};
