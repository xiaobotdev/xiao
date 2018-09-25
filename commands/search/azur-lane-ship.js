const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { AZUR_LANE_SHIP_ROOT } = process.env;

module.exports = class AzurLaneShipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'azur-lane-ship',
			aliases: ['azure-lane-ship', 'azur-lane', 'azure-lane', 'azur', 'azure'],
			group: 'search',
			memberName: 'azur-lane-ship',
			description: 'Responds with information on an Azur Lane ship.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'ship',
					prompt: 'What ship would you like to get information on?',
					type: 'string',
					parse: ship => encodeURIComponent(ship)
				}
			]
		});
	}

	async run(msg, { ship }) {
		try {
			const { body } = await request.get(`${AZUR_LANE_SHIP_ROOT}/${ship}`);
			const embed = new MessageEmbed()
				.setColor(0x1A1917)
				.setAuthor('Azur Lane', 'https://i.imgur.com/KeGXiZA.jpg', 'https://azurlane.yo-star.com')
				.setTitle(`${body.names.en} (${body.class} Class)`)
				.setURL(body.page_url)
				.setThumbnail(body.icon)
				.setFooter(`Ship #${body.id}`)
				.addField('❯ Construction Time', body.construction_time, true)
				.addField('❯ Rarity', body.rarity, true)
				.addField('❯ Nationality', body.nationality, true)
				.addField('❯ Type', body.type, true)
				.addField('❯ Health', `${body.base.health} (${body.max.health} Max)`, true)
				.addField('❯ Armor', body.base.armor, true)
				.addField('❯ Reload', `${body.base.reload} (${body.max.reload} Max)`, true)
				.addField('❯ Firepower', `${body.base.firepower} (${body.max.firepower} Max)`, true)
				.addField('❯ Torpedo', `${body.base.torpedo} (${body.max.torpedo} Max)`, true)
				.addField('❯ Evasion', `${body.base.speed} (${body.max.speed} Max)`, true)
				.addField('❯ Anti-Air', `${body.base.anti_air} (${body.max.anti_air} Max)`, true)
				.addField('❯ Anti-Sub', `${body.base.anti_sub} (${body.max.anti_sub} Max)`, true)
				.addField('❯ Aviation', `${body.base.air_power} (${body.max.air_power} Max)`, true)
				.addField('❯ Oil Cost', `${body.base.oil_usage} (${body.max.oil_usage} Max)`, true)
				.addField('❯ Speed', body.speed, true)
				.addField('❯ Chibi', `[Here](${body.chibi})`, true)
				.addField('❯ Equipment', stripIndents`
					${body.equipment[0].equippable} (${body.equipment[0].efficiency})
					${body.equipment[1].equippable} (${body.equipment[1].efficiency})
					${body.equipment[2].equippable} (${body.equipment[2].efficiency})
				`)
				.addField('❯ Images', body.images.map(img => `[${img.name}](${img.url})`).join(', '));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
