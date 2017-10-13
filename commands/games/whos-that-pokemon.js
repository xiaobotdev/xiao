const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { filterPkmn, pad } = require('../../util/Util');

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokemon', 'whos-that-pokémon', 'who-pokémon'],
			group: 'games',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		const pokemon = Math.floor(Math.random() * 721) + 1;
		try {
			const { body } = await snekfetch.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`);
			const names = body.names.map(name => name.name.toLowerCase());
			const displayName = filterPkmn(body.names).name;
			const image = `https://www.serebii.net/sunmoon/pokemon/${pad(body.id.toString(), '000')}.png`;
			await msg.say('**You have 15 seconds, who\'s that Pokémon?**', { files: [image] });
			const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
				max: 1,
				time: 15000
			});
			if (!msgs.size) return msg.say(`Time! It was ${displayName}, sorry!`);
			if (!names.includes(msgs.first().content.toLowerCase())) return msg.say(`Nope, sorry, it's ${displayName}.`);
			return msg.say('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
