const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const pokedex = require('./pkdex.json');

module.exports = class PokedexCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pokedex',
            aliases: [
                'pokemon'
            ],
            group: 'search',
            memberName: 'pokedex',
            description: 'Gives the pokedex entry for a Pokemon. (;pokedex Pikachu)',
            examples: [';pokedex Pikachu'],
            args: [{
                key: 'pokemon',
                prompt: 'What Pokémon would you like to get info on?',
                type: 'string',
                validate: pokemon => {
                    if (pokedex.name[pokemon.toLowerCase()]) {
                        return true;
                    }
                    return 'Please enter a valid Pokémon from either Kanto or Johto.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const pokemon = args.pokemon.toLowerCase();
        const embed = new RichEmbed()
            .setAuthor(`#${pokedex.index[pokemon]} ${pokedex.name[pokemon]}`, `http://www.serebii.net/pokedex-sm/icon/${pokedex.index[pokemon]}.png`)
            .setColor(0xFF0000)
            .setDescription(`pokedex.species[pokemon] Pokémon`)
            .setFooter('Pokédex - 001-251 Implemented', 'http://cdn.bulbagarden.net/upload/thumb/3/36/479Rotom-Pokédex.png/250px-479Rotom-Pokédex.png')
            .setThumbnail(`http://www.serebii.net/sunmoon/pokemon/${pokedex.index[pokemon]}.png`)
            .addField('Entry',
                pokedex.entry[pokemon])
            .addField('Type',
                pokedex.type[pokemon]);
        return message.embed(embed);
    }
};
