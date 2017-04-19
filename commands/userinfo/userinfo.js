const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'user',
            aliases: [
                'userinfo',
                'member',
                'memberinfo'
            ],
            group: 'userinfo',
            memberName: 'user',
            description: 'Gives some info on a user. (;user @User)',
            examples: [';user @User'],
            guildOnly: true,
            args: [{
                key: 'user',
                prompt: 'Which user would you like to get info on?',
                type: 'user'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { user } = args;
        const member = await message.guild.fetchMember(user);
        let stat;
        let color;
        switch (user.presence.status) {
            case 'online':
                stat = '<:vpOnline:212789758110334977> Online';
                color = 0x00AE86;
                break;
            case 'idle':
                stat = '<:vpAway:212789859071426561> Idle';
                color = 0xFFFF00;
                break;
            case 'dnd':
                stat = '<:vpDnD:230093576355184640> Do Not Disturb';
                color = 0xFF0000;
                break;
            case 'offline':
                stat = '<:vpOffline:212790005943369728> Offline';
                color = 0x808080;
                break;
        }
        const embed = new RichEmbed()
            .setColor(color)
            .setThumbnail(user.displayAvatarURL)
            .addField('**Name:**',
                user.tag, true)
            .addField('**ID:**',
                user.id, true)
            .addField('**Joined Discord On:**',
                `${user.createdAt}\n${moment.duration(Date.now() - user.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.`, true)
            .addField('**Joined Server On:**',
                `${member.joinedAt}\n${moment.duration(Date.now() - member.joinedTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.`, true)
            .addField('**Status:**',
                stat, true)
            .addField('**Playing:**',
                user.presence.game ? user.presence.game.name : 'None', true);
        return message.embed(embed);
    }
};
