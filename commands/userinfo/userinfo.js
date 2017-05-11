const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'user',
            aliases: ['user-info', 'member', 'member-info'],
            group: 'userinfo',
            memberName: 'user',
            description: 'Gives some info on a user.',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'Which user would you like to get info on?',
                    type: 'member'
                }
            ]
        });
    }

    run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { member } = args;
        let stat;
        let color;
        switch(member.user.presence.status) {
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
            .setThumbnail(member.user.displayAvatarURL)
            .addField('**Name:**',
                member.user.tag, true)
            .addField('**ID:**',
                member.id, true)
            .addField('**Joined Discord On:**',
                stripIndents`
                    ${moment(member.user.createdTimestamp).format('MMMM Do YYYY h:mm:ss a')}
                    ${moment.duration(Date.now() - member.user.createdTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.
                `, true)
            .addField('**Joined Server On:**',
                stripIndents`
                    ${moment(member.joinedTimestamp).format('MMMM Do YYYY h:mm:ss a')}
                    ${moment.duration(Date.now() - member.joinedTimestamp).format('y[ years], M[ months], w[ weeks, and ]d[ days]')} ago.
                `, true)
            .addField('**Status:**',
                stat, true)
            .addField('**Playing:**',
                member.user.presence.game ? member.user.presence.game.name : 'None', true);
        return msg.embed(embed);
    }
};
