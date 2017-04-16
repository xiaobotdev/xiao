const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
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
            description: 'Gives the pokedex info for a Pokemon. (;pokedex Pikachu)',
            examples: [';pokedex Pikachu'],
            args: [{
                key: 'pokemon',
                prompt: 'What Pokémon would you like to get info on?',
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const pokemon = args.pokemon.toLowerCase();
        const response = await snekfetch
            .get(`http://pokeapi.co/api/v2/pokemon/${pokemon}`);
        const data = response.body;
        const entry = pokedex.entry[pokemon] || 'Not Yet Implemented';
        const indexZero = '000'.slice(data.id.length);
        const type1 = data.types[1].type.name || '-';
        const type2 = data.types[0].type.name || '-';
        const embed = new RichEmbed()
            .setAuthor(`#${indexZero}${data.id} ${data.name}`, `http://www.serebii.net/pokedex-sm/icon/${indexZero}${data.id}.png`)
            .setColor(0xFF0000)
            .setDescription(entry)
            .setFooter('Pokédex', 'http://cdn.bulbagarden.net/upload/thumb/3/36/479Rotom-Pokédex.png/250px-479Rotom-Pokédex.png')
            .setThumbnail(data.sprites.front_default)
            .addField('**Types:**',
                `${type1} / ${type2}`)
            .addField('**Weight:**',
                `${data.weight / 10}kg`, true)
            .addField('**Height:**',
                `${data.height / 10}m`, true)
            .addField('**Base HP:**',
                data.stats[5].base_stat, true)
            .addField('**Base ATK:**',
                data.stats[4].base_stat, true)
            .addField('**Base DEF:**',
                data.stats[3].base_stat, true)
            .addField('**Base SPATK:**',
                data.stats[2].base_stat, true)
            .addField('**Base SPDEF:**',
                data.stats[1].base_stat, true)
            .addField('**Base SPD:**',
                data.stats[0].base_stat, true);
        return message.embed(embed);
    }
};
