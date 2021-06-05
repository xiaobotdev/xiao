const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const buttons = ['Q', 'W', 'E', 'R'];

module.exports = class LeagueOfLegendsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'league-of-legends',
			aliases: ['league-of-legends-champion', 'league-of-legends-champ', 'league-champ', 'lol-champ'],
			group: 'search',
			memberName: 'league-of-legends',
			description: 'Responds with information on a League of Legends champion.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Riot Games',
					url: 'https://www.riotgames.com/en',
					reason: 'API',
					reasonURL: 'https://developer.riotgames.com/'
				}
			],
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
	}

	async run(msg, { champion }) {
		if (champion === 'satan') champion = 'teemo';
		try {
			if (!this.version) await this.fetchVersion();
			const data = await this.fetchChampion(champion);
			if (!data) return msg.say('Could not find any results.');
			const tips = [].concat(data.allytips, data.enemytips);
			const embed = new MessageEmbed()
				.setColor(0x002366)
				.setAuthor('League of Legends', 'https://i.imgur.com/2JL4Rko.png', 'https://leagueoflegends.com/')
				.setTitle(`${data.name} ${data.title}`)
				.setDescription(data.blurb)
				.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${data.image.full}`)
				.addField('❯ Attack', data.info.attack, true)
				.addField('❯ Defense', data.info.defense, true)
				.addField('❯ Magic', data.info.magic, true)
				.addField('❯ Difficulty', data.info.difficulty, true)
				.addField('❯ HP', `${data.stats.hp} (${data.stats.hpperlevel}/level)`, true)
				.addField('❯ HP Regen', `${data.stats.hpregen} (${data.stats.hpregenperlevel}/level)`, true)
				.addField('❯ MP', `${data.stats.mp} (${data.stats.mpperlevel}/level)`, true)
				.addField('❯ MP Regen', `${data.stats.mpregen} (${data.stats.mpregenperlevel}/level)`, true)
				.addField('❯ Resource', data.partype, true)
				.addField('❯ Armor', `${data.stats.armor} (${data.stats.armorperlevel}/level)`, true)
				.addField('❯ Attack Damage', `${data.stats.attackdamage} (${data.stats.attackdamageperlevel}/level)`, true)
				.addField('❯ Attack Range', data.stats.attackrange, true)
				.addField('❯ Attack Speed', `${data.stats.attackspeed} (${data.stats.attackspeedperlevel}/level)`, true)
				.addField('❯ Crit', `${data.stats.crit} (${data.stats.critperlevel}/level)`, true)
				.addField('❯ Move Speed', data.stats.movespeed, true)
				.addField('❯ Spell Block', `${data.stats.spellblock} (${data.stats.spellblockperlevel}/level)`, true)
				.addField('❯ Passive', data.passive.name, true)
				.addField('❯ Spells', data.spells.map((spell, i) => `${spell.name} (${buttons[i]})`).join('\n'), true);
			return msg.say(`Tip: ${tips[Math.floor(Math.random() * tips.length)]}`, { embed });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchVersion() {
		const { body } = await request.get('https://ddragon.leagueoflegends.com/api/versions.json');
		[this.version] = body;
		setTimeout(() => { this.version = null; }, 3.6e+6);
		return body;
	}

	async fetchChampions() {
		if (this.champions && this.champions.version === this.version) return this.champions;
		const { body } = await request
			.get(`https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US/champion.json`);
		this.champions = body;
		return body;
	}

	async fetchChampion(champion) {
		const champions = await this.fetchChampions();
		const name = Object.keys(champions.data).find(key => key.toLowerCase() === champion);
		if (!name) return null;
		const { id } = champions.data[name];
		const { body } = await request
			.get(`https://ddragon.leagueoflegends.com/cdn/${this.version}/data/en_US/champion/${id}.json`);
		return body.data[id];
	}
};
