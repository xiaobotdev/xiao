const { Command } = require('discord.js-commando');
const { verify } = require('../../util/Util');

module.exports = class UnbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unban',
			aliases: ['unbanne'],
			group: 'moderation',
			memberName: 'unban',
			description: 'Unbans a user.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			args: [
				{
					key: 'id',
					prompt: 'What is the id of the member you want to unban?',
					type: 'string'
				},
				{
					key: 'reason',
					prompt: 'What do you want to set the reason as?',
					type: 'string',
					validate: reason => {
						if (reason.length < 140) return true;
						return 'Invalid reason, please keep the reason under 140 characters.';
					}
				}
			]
		});
	}

	async run(msg, { id, reason }) {
		const bans = await msg.guild.fetchBans();
		if (!bans.has(id)) return msg.say('This ID is not in the server banlist.');
		const member = bans.get(id).user;
		await msg.say(`Are you sure you want to unban ${member.tag} (${member.id})?`);
		const verification = await verify(msg.channel, msg.author);
		if (!verification) return msg.say('Aborting.');
		await msg.guild.unban(member, `${msg.author.tag}: ${reason}`);
		return msg.say(`Successfully unbanned ${member.tag}.`);
	}
};
