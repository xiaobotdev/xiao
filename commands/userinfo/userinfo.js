const commando = require('discord.js-commando');
const Discord = require('discord.js');

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
            examples: [";user @User"]
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log("[Command] " + message.content);
        if (message.channel.type !== 'dm') {
            let stat;
            switch (message.mentions.users.first().presence.status) {
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
            switch (message.mentions.users.first().presence.status) {
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
            if (message.mentions.users.size !== 1) {
                message.channel.send(':x: Error! Please mention one user!');
            }
            else {
                if (message.mentions.users.first().presence.game === null) {
                    const embed = new Discord.RichEmbed()
                        .setColor(color)
                        .setThumbnail(message.mentions.users.first().avatarURL)
                        .addField('**Name:**',
                            message.mentions.users.first().username + '#' + message.mentions.users.first().discriminator, true)
                        .addField('**ID:**',
                            message.mentions.users.first().id, true)
                        .addField('**Joined Discord On:**',
                            message.mentions.users.first().createdAt, true)
                        .addField('**Joined Server On:**',
                            message.guild.member(message.mentions.users.first()).joinedAt, true)
                        .addField('**Status:**',
                            stat, true)
                        .addField('**Playing:**',
                            "None", true);
                    message.channel.sendEmbed(embed).catch(console.error);
                }
                else {
                    const embed = new Discord.RichEmbed()
                        .setColor(color)
                        .setThumbnail(message.mentions.users.first().avatarURL)
                        .addField('**Name:**',
                            message.mentions.users.first().username + '#' + message.mentions.users.first().discriminator, true)
                        .addField('**ID:**',
                            message.mentions.users.first().id, true)
                        .addField('**Joined Discord On:**',
                            message.mentions.users.first().createdAt, true)
                        .addField('**Joined Server On:**',
                            message.guild.member(message.mentions.users.first()).joinedAt, true)
                        .addField('**Status:**',
                            stat, true)
                        .addField('**Playing:**',
                            message.mentions.users.first().presence.game.name, true);
                    message.channel.sendEmbed(embed).catch(console.error);
                }
            }
        }
        else {
            message.channel.send(":x: Error! This command does not work in DM!");
        }
    }
};
