const Command = require('../../structures/Command');

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
			args: [
				{
					key: 'nickname',
					prompt: 'What nickname do you want everyone to have?',
					type: 'string',
					min: 2,
					max: 32
				}
			]
		});
	}

	async run(msg, { nickname }) {
		try {
			await msg.reply('Fetching members...');
			await msg.guild.members.fetch();
			await msg.reply('Fetched members! Renaming...');
			let i = 0;
			for (const member of msg.guild.members.values()) {
				try {
					await member.setNickname(nickname);
				} catch (err) {
					i++;
					continue;
				}
			}
			return msg.reply(`Successfully renamed all but ${i} members to **${nickname}**!`);
		} catch (err) {
			return msg.reply(`Failed to rename everyone: \`${err.message}\``);
		}
	}
};
