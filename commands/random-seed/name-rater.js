const Command = require('../../framework/Command');
const { User } = require('discord.js');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/name-rater');
const { NAME_RATER_EMOJI_ID, NAME_RATER_EMOJI_NAME } = process.env;

module.exports = class NameRaterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'name-rater',
			aliases: ['name-rate', 'rate-name'],
			group: 'random-seed',
			memberName: 'name-rater',
			description: 'Determines a name\'s quality.',
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Sprite'
				}
			],
			args: [
				{
					key: 'name',
					type: 'string',
					max: 25,
					default: msg => msg.author.username,
					validate: async name => {
						const matches = name.match(/^(?:<@!?)([0-9]+)>$/);
						if (matches) {
							try {
								const user = await this.client.users.fetch(matches[1]);
								if (!user) return false;
								return true;
							} catch {
								return false;
							}
						}
						return true;
					},
					parse: name => {
						const matches = name.match(/^(?:<@!?)([0-9]+)>$/);
						if (matches) return this.client.users.cache.get(matches[1]) || null;
						return name;
					}
				}
			]
		});
	}

	run(msg, { name }) {
		if (name instanceof User) name = name.username;
		if (name.toLowerCase() === this.client.user.username.toLowerCase()) {
			return msg.say(`<:${NAME_RATER_EMOJI_NAME}:${NAME_RATER_EMOJI_ID}> Yes, ${name}! What a perfect name! I'm speechless!`);
		}
		const random = MersenneTwister19937.seed(this.stringToSeed(name.toLowerCase()));
		const quality = integer(0, texts.length - 1)(random);
		return msg.say(`<:${NAME_RATER_EMOJI_NAME}:${NAME_RATER_EMOJI_ID}> ${texts[quality].replace(/{{name}}/gi, name)}`);
	}

	stringToSeed(str) {
		if (!str) return 0;
		let hash = 0;
		for (const char of str.split('')) {
			hash += char.charCodeAt(0);
		}
		return hash;
	}
};
