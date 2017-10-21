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

		this.version = null;
		this.champions = null;
		this.cache = new Map();
		this.client.setInterval(() => this.cache.clear(), 3600000);
	}

	async run(msg, { champion }) {
		if (champion === 'satan') champion = 'teemo';
		try {
			let data;
			if (!this.cache.has(champion)) {
				if (!this.champions) await this.fetchChampions();
				const name = Object.keys(this.champions).find(key => key.toLowerCase() === champion);
				if (!name) return msg.say('Could not find any results.');
				const { id } = this.champions[name];
				const { body } = await snekfetch
					.get(`https://na1.api.riotgames.com/lol/static-data/v3/champions/${id}`)
					.query({
						api_key: RIOT_KEY,
						tags: 'all'
					});
				data = body;
				this.cache.set(champion, body);
			} else {
				data = this.cache.get(champion);
			}
			const tips = [].concat(data.allytips, data.enemytips);
			const embed = new MessageEmbed()
				.setColor(0x002366)
				.setAuthor('League of Legends', 'https://i.imgur.com/2JL4Rko.png')
				.setTitle(`${data.name} ${data.title}`)
				.setDescription(data.blurb)
				.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${data.image.full}`)
				.addField('❯ Attack',
					data.info.attack, true)
				.addField('❯ Defense',
					data.info.defense, true)
				.addField('❯ Magic',
					data.info.magic, true)
				.addField('❯ Difficulty',
					data.info.difficulty, true)
				.addField('❯ HP',
					`${data.stats.hp} (${data.stats.hpperlevel}/level)`, true)
				.addField('❯ HP Regen',
					`${data.stats.hpregen} (${data.stats.hpregenperlevel}/level)`, true)
				.addField('❯ MP',
					`${data.stats.mp} (${data.stats.mpperlevel}/level)`, true)
				.addField('❯ MP Regen',
					`${data.stats.mpregen} (${data.stats.mpregenperlevel}/level)`, true)
				.addField('❯ Resource',
					data.partype, true)
				.addField('❯ Armor',
					`${data.stats.armor} (${data.stats.armorperlevel}/level)`, true)
				.addField('❯ Attack Damage',
					`${data.stats.attackdamage} (${data.stats.attackdamageperlevel}/level)`, true)
				.addField('❯ Attack Range',
					data.stats.attackrange, true)
				.addField('❯ Attack Speed Offset',
					`${data.stats.attackspeedoffset} (${data.stats.attackspeedperlevel}/level)`, true)
				.addField('❯ Crit',
					`${data.stats.crit} (${data.stats.critperlevel}/level)`, true)
				.addField('❯ Move Speed',
					data.stats.movespeed, true)
				.addField('❯ Spell Block',
					`${data.stats.spellblock} (${data.stats.spellblockperlevel}/level)`, true)
				.addField('❯ Passive',
					shorten(`**${data.passive.name}**: ${data.passive.sanitizedDescription}`, 1000))
				.addField('❯ Spells',
					data.spells.map((spell, i) => `${spell.name} (${buttons[i]})`).join('\n'));
			return msg.say(`Tip: ${tips[Math.floor(Math.random() * tips.length)]}`, { embed });
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchChampions() {
		const { body } = await snekfetch
			.get('https://na1.api.riotgames.com/lol/static-data/v3/champions')
			.query({ api_key: RIOT_KEY });
		this.version = body.version;
		this.champions = body.data;
		return body.data;
	}
};
