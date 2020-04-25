const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const moment = require('moment');
const classStats = require('../../assets/json/paladins');
const { FLANKER_EMOJI_ID, DAMAGE_EMOJI_ID, FRONT_LINE_EMOJI_ID, SUPPORT_EMOJI_ID } = process.env;

module.exports = class PaladinsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'paladins',
			aliases: ['paladins-guru'],
			group: 'search',
			memberName: 'paladins',
			description: 'Responds with information on a Paladins player.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Evil Mojo Games',
					url: 'https://www.evilmojogames.com/',
					reason: 'Original "Paladins" Game',
					reasonURL: 'https://www.paladins.com/'
				},
				{
					name: 'PaladinsGuru',
					url: 'https://paladins.guru/',
					reason: 'API'
				}
			],
			args: [
				{
					key: 'player',
					prompt: 'What player would you like to get information on?',
					type: 'string'
				}
			]
		});

		this.champions = null;
	}

	async run(msg, { player }) {
		try {
			const search = await this.search(player);
			if (!search) return msg.say('Could not find any results.');
			const data = await this.fetchPlayer(search.id);
			if (!this.champions) await this.fetchChampions();
			const champions = data.champions.map(champ => {
				const champData = this.champions[champ.id];
				const classStat = classStats[champData.class];
				const emoji = this.classEmoji(champData.class);
				return `${emoji} ${champData.name} (${champ[classStat.id]} ${classStat.display})`;
			});
			const embed = new MessageEmbed()
				.setColor(0x1E9BAD)
				.setAuthor('Paladins Guru', 'https://i.imgur.com/iIAdriK.png', 'https://paladins.guru/')
				.addField('❯ Name', data.player.name, true)
				.addField('❯ ID', data.player.id, true)
				.addField('❯ Level', data.player.level, true)
				.addField('❯ Last Seen', moment.utc(data.player.seen).format('MM/DD/YYYY h:mm A'), true)
				.addField('❯ Region', data.player.region, true)
				.addField('❯ Team', data.player.team || 'Free Agent', true)
				.addField('❯ Top 5 Champions', champions.slice(0, 5).join('\n'));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async search(query) {
		const { body } = await request
			.get('https://api.paladins.guru/v3/search')
			.query({
				term: query,
				type: 'Player'
			});
		if (!body.length) return null;
		return body[0];
	}

	async fetchPlayer(id) {
		const { body } = await request.get(`https://api.paladins.guru/v3/profiles/${id}/summary`);
		return body;
	}

	async fetchChampions() {
		if (this.champions) return this.champions;
		const { body } = await request.get('https://api.paladins.guru/v3/champions/');
		this.champions = body;
		setTimeout(() => { this.champions = null; }, 3.6e+6);
		return body;
	}

	classEmoji(className) {
		let emojiID;
		switch (className) {
			case 'Flanker': emojiID = FLANKER_EMOJI_ID; break;
			case 'Support': emojiID = SUPPORT_EMOJI_ID; break;
			case 'Damage': emojiID = DAMAGE_EMOJI_ID; break;
			case 'Front Line': emojiID = FRONT_LINE_EMOJI_ID; break;
		}
		return `<:${className.replace(/ /g, '')}:${emojiID}>`
	}
};
