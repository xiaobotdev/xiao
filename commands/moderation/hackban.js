const { Command } = require('discord.js-commando');
const { verify } = require('../../util/Util');

module.exports = class HackbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hackban',
			aliases: ['hackbanne'],
			group: 'moderation',
			memberName: 'hackban',
			description: 'Bans a user who doesn\'t have to be in the server.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'id',
					prompt: 'What is the id of the member you want to hackban?',
					type: 'string',
					validate: id => {
						if (/^[0-9]+$/.test(id)) return true;
						return 'Invalid ID.';
					}
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

	async run(msg, { id, reason }) {
		if (id === msg.author.id) return msg.reply('I don\'t think you want to ban yourself...');
		if (id === msg.guild.ownerID) return msg.reply('Don\'t you think that might be betraying your leader?');
		let user;
		try {
			user = await this.client.users.fetch(id);
		} catch (err) {
			return msg.reply('Could not resolve user.');
		}
		await msg.say(`Are you sure you want to hackban ${user.tag} (${user.id})?`);
		const verification = await verify(msg.channel, msg.author);
		if (!verification) return msg.say('Aborting.');
		try {
			await msg.guild.ban(id, {
				days: 7,
				reason: `${msg.author.tag}: ${reason}`
			});
		} catch (err) {
			return msg.reply(`Failed to hackban ${user.tag}: \`${err.message}\`.`);
		}
		return msg.say(`Successfully hackbanned ${user.tag}.`);
	}
};
