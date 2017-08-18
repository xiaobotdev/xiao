const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { filterTopics } = require('../../structures/Util');

module.exports = class HackbanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hackban',
			aliases: ['hackbanne'],
			group: 'moderation',
			memberName: 'hackban',
			description: 'Bans a user who doesn\'t have to be in the server and logs the ban to the mod logs.',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['ADMINISTRATOR'],
			args: [
				{
					key: 'id',
					prompt: 'What is the id of the member you want to hackban?',
					type: 'string'
				},
				{
					key: 'reason',
					prompt: 'What do you want to set the reason as?',
					type: 'string',
					validate: reason => {
						if (reason.length < 140) return true;
						return 'Reason must be under 140 characters.';
					}
				}
			]
		});
	}

	async run(msg, args) {
		const modlogs = filterTopics(msg.guild.channels, 'modlog').first();
		const { id, reason } = args;
		if (id === msg.author.id) return msg.say('I don\'t think you want to ban yourself...');
		let user;
		try {
			user = await this.client.fetchUser(id);
		} catch (err) {
			return msg.say('Could not resolve user.');
		}
		await msg.say(`Are you sure you want to ban ${user.tag} (${user.id})?`);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 30000
		});
		if (!msgs.size || !['y', 'yes'].includes(msgs.first().content.toLowerCase())) return msg.say('Aborting.');
		await msg.guild.ban({
			days: 7,
			reason: `${msg.author.tag}: ${reason}`
		});
		await msg.say(`Successfully banned ${user.tag}.`);
		if (!modlogs) {
			return msg.say('Could not log the ban to the mod logs.');
		} else if (modlogs.permissionsFor(this.client.user).has('EMBED_LINKS')) {
			const embed = new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setColor(0xA90000)
				.setTimestamp()
				.setDescription(stripIndents`
					**Member:** ${user.tag} (${user.id})
					**Action:** Hackban
					**Reason:** ${reason}
				`);
			return modlogs.send({ embed });
		} else {
			return modlogs.send(stripIndents`
				**Member:** ${user.tag} (${user.id})
				**Action:** Hackban
				**Reason:** ${reason}
				**Moderator:** ${msg.author.tag}
			`);
		}
	}
};
