const Command = require('../../structures/Command');
const { verify } = require('../../util/Util');

module.exports = class RenameAllCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rename-all',
			group: 'other',
			memberName: 'rename-all',
			description: 'Renames every member of the server.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guildOnly: true,
			clientPermissions: ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'],
			userPermissions: ['ADMINISTRATOR'],
			credit: [
				{
					name: 'Gawdl3y',
					url: 'https://github.com/Gawdl3y',
					reason: 'Concept'
				}
			],
			args: [
				{
					key: 'nickname',
					prompt: 'What nickname do you want everyone to have?',
					type: 'string',
					min: 2,
					max: 32,
					parse: nickname => {
						if (nickname.toLowerCase() === 'none') return '';
						return nickname;
					}
				}
			]
		});
	}

	async run(msg, { nickname }) {
		try {
			await msg.reply(
				`Are you sure you want to ${nickname ? `rename everyone to **${nickname}**` : 'remove all nicknames'}?`
			);
			const verification = await verify(msg.channel, msg.author);
			if (!verification) return msg.say('Aborted.');
			await msg.reply('Fetching members...');
			await msg.guild.members.fetch();
			await msg.reply('Fetched members! Renaming...');
			let i = 0;
			for (const member of msg.guild.members.cache.values()) {
				try {
					await member.setNickname(nickname);
				} catch {
					i++;
					continue;
				}
			}
			if (!nickname) return msg.reply('Successfully removed all nicknames!');
			return msg.reply(`Successfully renamed all but ${i} member${i === 1 ? '' : 's'} to **${nickname}**!`);
		} catch (err) {
			return msg.reply(`Failed to rename everyone: \`${err.message}\``);
		}
	}
};
