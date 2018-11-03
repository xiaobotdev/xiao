const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../util/Util');
const activities = {
	PLAYING: 'Playing',
	STREAMING: 'Streaming',
	WATCHING: 'Watching',
	LISTENING: 'Listening to'
};

module.exports = class UserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'user',
			aliases: ['user-info', 'member', 'member-info'],
			group: 'info',
			memberName: 'user',
			description: 'Responds with detailed information on a user.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'user',
					prompt: 'Which user would you like to get information on?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
		const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
		const embed = new MessageEmbed()
			.setThumbnail(user.displayAvatarURL({ format }))
			.addField('❯ Name', user.tag, true)
			.addField('❯ ID', user.id, true)
			.addField('❯ Discord Join Date', moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A'), true)
			.addField('❯ Bot?', user.bot ? 'Yes' : 'No', true);
		if (msg.channel.type === 'text') {
			try {
				const member = await msg.guild.members.fetch(user.id);
				const roles = member.roles
					.filter(role => role.id !== msg.guild.defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
				embed
					.setColor(member.displayHexColor)
					.setDescription(member.presence.activity
						? `${activities[member.presence.activity.type]} **${member.presence.activity.name}**`
						: '')
					.addField('❯ Server Join Date', moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A'), true)
					.addField('❯ Nickname', member.nickname || 'None', true)
					.addField('❯ Highest Role',
						member.roles.highest.id === msg.guild.defaultRole.id ? 'None' : member.roles.highest.name, true)
					.addField('❯ Hoist Role', member.roles.hoist ? member.roles.hoist.name : 'None', true)
					.addField(`❯ Roles (${roles.length})`, roles.length ? trimArray(roles, 10).join(', ') : 'None');
			} catch (err) {
				embed.setFooter('Failed to resolve member, showing basic user information instead.');
			}
		}
		return msg.embed(embed);
	}
};
