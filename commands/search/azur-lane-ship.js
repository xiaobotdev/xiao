const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');

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
					key: 'query',
					prompt: 'What ship would you like to get information on?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await request
				.get(`https://al-shipgirls.pw/shipyard/ship_info_detailed/`)
				.query({ search: query });
			if (!body.length) return msg.say('Could not find any results.');
			const data = body[0].item;
			const embed = new MessageEmbed()
				.setColor(0x1A1917)
				.setAuthor('Azur Lane', 'https://i.imgur.com/KeGXiZA.jpg', 'https://azurlane.yo-star.com')
				.setTitle(`${data.names.en} (${data.class} Class)`)
				.setURL(data.page_url)
				.setThumbnail(data.icon)
				.setFooter(`Ship #${data.id}`)
				.addField('❯ Construction Time', data.construction_time, true)
				.addField('❯ Rarity', data.rarity, true)
				.addField('❯ Nationality', data.nationality, true)
				.addField('❯ Type', data.type, true)
				.addField('❯ Health', `${formatNumber(data.base.health)} (${formatNumber(data.max.health)} Max)`, true)
				.addField('❯ Armor', data.base.armor, true)
				.addField('❯ Reload', `${formatNumber(data.base.reload)} (${formatNumber(data.max.reload)} Max)`, true)
				.addField('❯ Firepower', `${formatNumber(data.base.firepower)} (${formatNumber(data.max.firepower)} Max)`, true)
				.addField('❯ Torpedo', `${formatNumber(data.base.torpedo)} (${formatNumber(data.max.torpedo)} Max)`, true)
				.addField('❯ Evasion', `${formatNumber(data.base.speed)} (${formatNumber(data.max.speed)} Max)`, true)
				.addField('❯ Anti-Air', `${formatNumber(data.base.anti_air)} (${formatNumber(data.max.anti_air)} Max)`, true)
				.addField('❯ Anti-Sub', `${formatNumber(data.base.anti_sub)} (${formatNumber(data.max.anti_sub)} Max)`, true)
				.addField('❯ Aviation', `${formatNumber(data.base.air_power)} (${formatNumber(data.max.air_power)} Max)`, true)
				.addField('❯ Oil Cost', `${formatNumber(data.base.oil_usage)} (${formatNumber(data.max.oil_usage)} Max)`, true)
				.addField('❯ Equipment', stripIndents`
					${data.equipment[0].equippable} (${data.equipment[0].efficiency})
					${data.equipment[1].equippable} (${data.equipment[1].efficiency})
					${data.equipment[2].equippable} (${data.equipment[2].efficiency})
				`)
				.addField('❯ Images',
					`${data.images.map(img => `[${img.name}](${img.url})`).join(', ')}, [Chibi](${data.chibi})`);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
