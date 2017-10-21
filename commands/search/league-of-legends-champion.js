const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { shorten } = require('../../util/Util');
const { RIOT_KEY } = process.env;
const buttons = ['Q', 'W', 'E', 'R'];

module.exports = class LeagueOfLegendsChampionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'league-of-legends-champion',
			aliases: ['lol-champion', 'champion', 'league-of-legends-champ', 'lol-champ', 'champ'],
			group: 'search',
			memberName: 'league-of-legends-champion',
			description: 'Gets information on a League of Legends champion.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'champion',
					prompt: 'What champion would you like to get information on?',
					type: 'string',
					parse: champion => champion.toLowerCase()
				}
			]
		});
	}

	async run(msg, { champion }) {
		if (champion === 'satan') champion = 'teemo';
		try {
			const search = await snekfetch
				.get('https://na1.api.riotgames.com/lol/static-data/v3/champions')
				.query({ api_key: RIOT_KEY });
			const name = Object.keys(search.body.data).find(key => key.toLowerCase() === champion);
			if (!name) return msg.say('Could not find any results.');
			const { id } = search.body.data[name];
			const { body } = await snekfetch
				.get(`https://na1.api.riotgames.com/lol/static-data/v3/champions/${id}`)
				.query({
					api_key: RIOT_KEY,
					tags: 'all'
				});
			const tips = [].concat(body.allytips, body.enemytips);
			const embed = new MessageEmbed()
				.setColor(0x002366)
				.setAuthor('League of Legends', 'https://i.imgur.com/2JL4Rko.png')
				.setTitle(`${body.name} ${body.title}`)
				.setDescription(body.blurb)
				.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${search.body.version}/img/champion/${body.image.full}`)
				.addField('❯ Attack',
					body.info.attack, true)
				.addField('❯ Defense',
					body.info.defense, true)
				.addField('❯ Magic',
					body.info.magic, true)
				.addField('❯ Difficulty',
					body.info.difficulty, true)
				.addField('❯ HP',
					`${body.stats.hp} (${body.stats.hpperlevel}/level)`, true)
				.addField('❯ HP Regen',
					`${body.stats.hpregen} (${body.stats.hpregenperlevel}/level)`, true)
				.addField('❯ MP',
					`${body.stats.mp} (${body.stats.mpperlevel}/level)`, true)
				.addField('❯ MP Regen',
					`${body.stats.mpregen} (${body.stats.mpregenperlevel}/level)`, true)
				.addField('❯ Resource',
					body.partype, true)
				.addField('❯ Armor',
					`${body.stats.armor} (${body.stats.armorperlevel}/level)`, true)
				.addField('❯ Attack Damage',
					`${body.stats.attackdamage} (${body.stats.attackdamageperlevel}/level)`, true)
				.addField('❯ Attack Range',
					body.stats.attackrange, true)
				.addField('❯ Attack Speed Offset',
					`${body.stats.attackspeedoffset} (${body.stats.attackspeedperlevel}/level)`, true)
				.addField('❯ Crit',
					`${body.stats.crit} (${body.stats.critperlevel}/level)`, true)
				.addField('❯ Move Speed',
					body.stats.movespeed, true)
				.addField('❯ Spell Block',
					`${body.stats.spellblock} (${body.stats.spellblockperlevel}/level)`, true)
				.addField('❯ Passive',
					shorten(`**${body.passive.name}**: ${body.passive.sanitizedDescription}`, 1000))
				.addField('❯ Spells',
					body.spells.map((spell, i) => `${spell.name} (${buttons[i]})`).join('\n'));
			return msg.say(`Tip: ${tips[Math.floor(Math.random() * tips.length)]}`, { embed });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
