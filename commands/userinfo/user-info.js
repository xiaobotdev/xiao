const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
const statuses = {
    online: '<:online:313956277808005120> Online',
    idle: '<:away:313956277220802560> Idle',
    dnd: '<:dnd:313956276893646850> Do Not Disturb',
    offline: '<:offline:313956277237710868> Offline'
};
const colors = {
    online: 0x00AE86,
    idle: 0xFFFF00,
    dnd: 0xFF0000,
    offline: 0x808080
};

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'user-info',
            aliases: ['user', 'member', 'member-info'],
            group: 'userinfo',
            memberName: 'user',
            description: 'Gives some info on a user.',
            guildOnly: true,
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'member',
                    prompt: 'Which user would you like to get info on?',
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    run(msg, args) {
        const member = args.member || msg.member;
        const status = member.user.presence.status;
        const embed = new RichEmbed()
            .setColor(colors[status])
            .setThumbnail(member.user.displayAvatarURL)
            .addField('❯ Name',
                member.user.tag, true)
            .addField('❯ ID',
                member.id, true)
            .addField('❯ Discord Join Date',
                moment(member.user.createdAt).format('MMMM Do YYYY h:mm:ss A'))
            .addField('❯ Server Join Date',
                moment(member.joinedTimestamp).format('MMMM Do YYYY h:mm:ss A'))
            .addField('❯ Status',
                statuses[status], true)
            .addField('❯ Playing',
                member.user.presence.game ? member.user.presence.game.name : 'None', true);
        return msg.embed(embed);
    }
};
