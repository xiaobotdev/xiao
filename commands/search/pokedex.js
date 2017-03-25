const commando = require('discord.js-commando');
const Discord = require('discord.js');
const pokedex = require('./pkdex.json');

module.exports = class PokedexCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
                type: 'string'
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let pokemon = args.pokemon;
        if (!pokedex.name[pokemon.toLowerCase()]) return message.channel.send(':x: Error! This Pokémon is either not valid, or is not yet implemented!');
        const embed = new Discord.RichEmbed()
            .setTitle('Information')
            .setAuthor(`#${pokedex.index[pokemon]} ${pokedex.name[pokemon]}`, `http://www.serebii.net/pokedex-sm/icon/${pokedex.index[pokemon]}.png`)
            .setColor(0xFF0000)
            .setDescription(pokedex.species[pokemon])
            .setFooter("Pokédex", "http://cdn.bulbagarden.net/upload/thumb/3/36/479Rotom-Pokédex.png/250px-479Rotom-Pokédex.png")
            .setThumbnail(`http://www.serebii.net/sunmoon/pokemon/${pokedex.index[pokemon]}.png`)
            .addField('Entry',
                pokedex.entry[pokemon])
            .addField('Type',
                pokedex.type[pokemon]);
        return message.channel.sendEmbed(embed);
    }
};
