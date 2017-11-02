const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');

module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ban',
			aliases: ['banne'],
			group: 'moderation',
			memberName: 'ban',
			description: 'Bans a user.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			args: [
				{
					key: 'member',
					prompt: 'What member do you want to ban?',
					type: 'member'
				},
				{
					key: 'reason',
					prompt: 'What do you want to set the reason as?',
					type: 'string',
					max: 140
				}
			]
		});
	}

	async run(msg, { member, reason }) {
		if (member.id === msg.author.id) return msg.reply('I don\'t think you want to ban yourself...');
		if (member.id === msg.guild.ownerID) return msg.reply('Don\'t you think that might be betraying your leader?');
		if (!member.bannable) return msg.reply('This member is not bannable. Perhaps they have a higher role than me?');
		if (member.highestRole.position > msg.member.highestRole.position - 1) {
			return msg.reply('Your roles are too low to ban this member.');
		}
		await msg.say(`Are you sure you want to ban ${member.user.tag} (${member.id})?`);
		const verification = await verify(msg.channel, msg.author);
		if (!verification) return msg.say('Aborting.');
		try {
			await member.send(stripIndents`
				You were banned from ${msg.guild.name} by ${msg.author.tag}!
				**Reason**: ${reason}
			`);
		} catch (err) {
			await msg.say('Failed to send DM.');
		}
		try {
			await member.ban({
				days: 7,
				reason: `${msg.author.tag}: ${reason}`
			});
		} catch (err) {
			return msg.reply(`Failed to ban ${member.user.tag}: \`${err.message}\`.`);
		}
		return msg.say(`Successfully banned ${member.user.tag}.`);
	}
};
