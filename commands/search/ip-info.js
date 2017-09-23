const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class IPInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ip-info',
			group: 'search',
			memberName: 'ip-info',
			description: 'Gets data for an IP address.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'ip',
					prompt: 'Which IP would you like to get information on?',
					type: 'string',
					parse: ip => encodeURIComponent(ip)
				}
			]
		});
	}

	async run(msg, { ip }) {
		try {
			const { body } = await snekfetch
				.get(`https://ipinfo.io/${ip}/json`);
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setURL(`https://ipinfo.io/${ip}`)
				.setTitle(body.ip)
				.addField('❯ Hostname',
					body.hostname, true)
				.addField('❯ Location',
					body.loc, true)
				.addField('❯ Organization',
					body.org, true)
				.addField('❯ City',
					`${body.city} (${body.postal})`, true)
				.addField('❯ Region',
					body.region, true)
				.addField('❯ Country',
					body.country, true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
