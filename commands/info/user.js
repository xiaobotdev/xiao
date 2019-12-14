const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
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
			.setAuthor(user.tag)
			.setThumbnail(user.displayAvatarURL({ format }));
		let description = stripIndents`
			**General User Info:**
			• ID: ${user.id}
			• Discord Join Date: ${moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A')}
			• ${user.bot ? 'Bot' : 'Not a Bot'}
		`;
		if (msg.channel.type === 'text') {
			try {
				const member = await msg.guild.members.fetch(user.id);
				const defaultRole = msg.guild.roles.get(msg.guild.id);
				const roles = member.roles
					.filter(role => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
				description += stripIndents`

					**Server Member Info:**
					• Nickname: ${member.nickname || 'None'}
					• Server Join Date: ${moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A')}
					• Highest Role: ${member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name}
					• Hoist Role: ${member.roles.hoist ? member.roles.hoist.name : 'None'}

					**Roles (${roles.length})**
					• ${roles.length ? trimArray(roles, 6).join(', ') : 'None'}
				`;
				embed.setColor(member.displayHexColor);
			} catch (err) {
				embed.setFooter('Failed to resolve member, showing basic user information instead.');
			}
		}
		embed.setDescription(description);
		return msg.embed(embed);
	}
};
