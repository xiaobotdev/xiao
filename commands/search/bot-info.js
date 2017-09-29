const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { DBOTS_KEY } = process.env;

module.exports = class BotInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bot-info',
			aliases: ['discord-bots', 'dbots'],
			group: 'search',
			memberName: 'bot-info',
			description: 'Searches Discord Bots for information on a bot.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'bot',
					prompt: 'Which bot do you want to get information on?',
					type: 'user'
				}
			]
		});
	}

	async run(msg, { bot }) {
		try {
			const { body } = await snekfetch
				.get(`https://bots.discord.pw/api/bots/${bot.id}`)
				.set({ Authorization: DBOTS_KEY });
			const owners = [];
			for (const owner of body.owner_ids) {
				const user = await this.client.users.fetch(owner);
				owners.push(user.tag);
			}
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setAuthor('Discord Bots', 'https://i.imgur.com/tHTKaks.jpg')
				.setTitle(body.name)
				.setURL(`https://bots.discord.pw/bots/${bot.id}`)
				.setDescription(body.description)
				.addField('❯ Library',
					body.library, true)
				.addField('❯ Invite',
					`[Here](${body.invite_url})`, true)
				.addField('❯ Prefix',
					body.prefix, true)
				.addField('❯ Owner(s)',
					owners.join(', '), true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
