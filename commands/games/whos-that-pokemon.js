const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { filterPkmn } = require('../../structures/Util');

module.exports = class WhosThatPokemonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon',
			aliases: ['who-pokmeon', '', 'whos-that-pokémon', 'who-pokémon'],
			group: 'games',
			memberName: 'whos-that-pokemon',
			description: 'Guess who that Pokémon is.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const pokemon = Math.floor(Math.random() * 721) + 1;
		const { body } = await snekfetch
			.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
		const name = filterPkmn(body.names).name.toLowerCase();
		const id = `${'000'.slice(body.id.toString().length)}${body.id}`;
		const embed = new MessageEmbed()
			.setTitle('You have 15 seconds, who\'s that Pokémon?')
			.setColor(0xED1C24)
			.setImage(`https://www.serebii.net/sunmoon/pokemon/${id}.png`);
		await msg.embed(embed);
		const msgs = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
			max: 1,
			time: 15000
		});
		if (!msgs.size) return msg.say(`Time! It was ${name}, sorry!`);
		if (msgs.first().content.toLowerCase() !== name) return msg.say(`Nope, sorry, it's ${name}.`);
		return msg.say('Nice job! 10/10! You deserve some cake!');
	}
};
