const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');
const cheerio = require('cheerio');
const { ANIMELIST_LOGIN } = process.env;

module.exports = class AnimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            group: 'search',
            memberName: 'anime',
            description: 'Searches My Anime List for a specified anime.',
            args: [
                {
                    key: 'query',
                    prompt: 'What anime would you like to search for?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { text } = await request
                .get(`https://${ANIMELIST_LOGIN}@myanimelist.net/api/anime/search.xml?q=${query}`)
                .buffer(true);
            const $ = cheerio.load(text, { xmlMode: true });
            const embed = new RichEmbed()
                .setColor(0x2D54A2)
                .setAuthor('My Anime List', 'https://i.imgur.com/R4bmNFz.png')
                .setURL(`https://myanimelist.net/anime/${$('id').first().text()}`)
                .setThumbnail($('image').first().text())
                .setTitle(`${$('title').first().text()} (${$('english').first().text()})`)
                .setDescription($('synopsis').first().text().substr(0, 2000))
                .addField('Type',
                    `${$('type').first().text()} - ${$('status').first().text()}`)
                .addField('Episodes',
                    $('episodes').first().text(), true)
                .addField('Start Date',
                    $('start_date').first().text(), true)
                .addField('End Date',
                    $('end_date').first().text(), true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(err);
        }
    }
};
