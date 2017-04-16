const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const cheerio = require('cheerio');

module.exports = class PokedexCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pokedex',
            aliases: [
                'pokemon'
            ],
            group: 'search',
            memberName: 'pokedex',
            description: 'Gives the pokedex entry for a Pokemon. (;pokedex 001)',
            examples: [';pokedex 001'],
            args: [{
                key: 'index',
                prompt: 'What Pokémon would you like to get info on?',
                type: 'integer',
                validate: pokemon => {
                    if (pokemon < 803 && pokemon > 0) {
                        return true;
                    }
                    return 'Please enter a pokedex number from 001-802';
                }
            }]
        });
    }

    async run(message, args) {
            if (message.channel.type !== 'dm') {
                if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
                if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
            }
            let index = args.index;
            let dex = 'xy';
            let location = 'foox';
            let location2 = 'fooy';
            if (index > 721) {
                dex = 'sm';
                location = 'foosun';
                location2 = 'foomoon';
            }
            index = index.toString();
            const pad = '000'.slice(index.length);
            index = `${pad}${index}`;
            try {
                const response = await snekfetch
                    .get(`http://www.serebii.net/pokedex-${dex}/${index}.shtml`);
                const $ = cheerio.load(response.text);
                const entry = $(`td.${location}`).eq(1).next().text();
                const entry2 = $(`td.${location2}`).eq(1).next().text();
                const embed = new RichEmbed()
                    .setAuthor(`#${index}`, `http://www.serebii.net/pokedex-sm/icon/${index}.png`)
                    .setColor(0xFF0000)
                    .setFooter('Pokédex', 'http://cdn.bulbagarden.net/upload/thumb/3/36/479Rotom-Pokédex.png/250px-479Rotom-Pokédex.png')
                    .setThumbnail(`http://www.serebii.net/sunmoon/pokemon/${index}.png`)
                    .addField('**Entry 1:**',
                        entry)
                    .addField('**Entry 2:**',
                        entry2);
                return message.embed(embed);
            }
            catch (err) {
                return message.say(':x: Error! Something went wrong!');
            }
    }
};
