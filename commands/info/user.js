const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
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
		const embed = new MessageEmbed()
			.setAuthor(user.tag)
			.setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }));
		const userFlags = user.flags.toArray();
		let description = stripIndents`
			**General User Info:**
			• ID: ${user.id}
			• Discord Join Date: ${moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A')}
			• ${user.bot ? 'Bot' : 'Not a Bot'}
			• Flags: ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}
		`;
		if (msg.guild) {
			try {
				const member = await msg.guild.members.fetch(user.id);
				const defaultRole = msg.guild.roles.cache.get(msg.guild.id);
				const roles = member.roles.cache
					.filter(role => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name);
				description += '\n\n';
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
			} catch {
				embed.setFooter('Failed to resolve member, showing basic user information instead.');
			}
		}
		embed.setDescription(description);
		return msg.embed(embed);
	}
};
