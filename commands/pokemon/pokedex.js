const commando = require('discord.js-commando');
const Discord = require('discord.js');
const pokedex = require('./pkdex.json');

class PokedexCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'pokedex', 
            group: 'pokemon',
            memberName: 'pokedex',
            description: 'Gives the pokedex entry for a Pokemon. (;pokedex Pikachu)',
            examples: [';pokedex Pikachu']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let pokemon = message.content.toLowerCase().split(" ").slice(1).join(" ");
        if (pokedex.name[pokemon]) {
            const embed = new Discord.RichEmbed()
            .setTitle('Information')
            .setAuthor(pokedex.name[pokemon], pokedex.sprite[pokemon])
            .setColor(0xFF0000)
            .setDescription(pokedex.species[pokemon])
            .setFooter(pokedex.dexname, pokedex.dexicon)
            .setThumbnail(pokedex.picture[pokemon])
            .addField('Entry',
            pokedex.entry[pokemon])
            .addField('Type',
            pokedex.type[pokemon]);
            message.channel.sendEmbed(embed).catch(console.error);
        } else {message.reply(":x: This Pokémon either doesn't exist, or isn't implemented yet.");}
    }
}

module.exports = PokedexCommand;