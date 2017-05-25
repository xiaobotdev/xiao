const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const xml = promisifyAll(require('xml2js'));
const { ANIMELIST_LOGIN } = process.env;

module.exports = class MangaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'manga',
            group: 'search',
            memberName: 'manga',
            description: 'Searches My Anime List for a specified manga.',
            args: [
                {
                    key: 'query',
                    prompt: 'What manga would you like to search for?',
                    type: 'string'
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
            const { text } = await snekfetch
                .get(`https://${ANIMELIST_LOGIN}@myanimelist.net/api/manga/search.xml`)
                .query({
                    q: query
                });
            const { manga } = await xml.parseStringAsync(text);
            const synopsis = manga.entry[0].synopsis[0].substr(0, 2000)
                .replace(/(<br \/>)/g, '')
                .replace(/(&#039;)/g, '\'')
                .replace(/(&mdash;)/g, '—')
                .replace(/(&#034;)/g, '"')
                .replace(/(&#038;)/g, '&')
                .replace(/(&quot;)/g, '"')
                .replace(/(\[i\]|\[\/i\])/g, '*');
            const embed = new RichEmbed()
                .setColor(0x2D54A2)
                .setAuthor('My Anime List', 'https://i.imgur.com/R4bmNFz.png')
                .setURL(`https://myanimelist.net/manga/${manga.entry[0].id[0]}`)
                .setThumbnail(manga.entry[0].image[0])
                .setTitle(`${manga.entry[0].title[0]} (English: ${manga.entry[0].english[0] || 'N/A'})`)
                .setDescription(synopsis)
                .addField('Type',
                    `${manga.entry[0].type[0]} - ${manga.entry[0].status[0]}`, true)
                .addField('Volumes / Chapters',
                    `${manga.entry[0].volumes[0]} / ${manga.entry[0].chapters[0]}`, true)
                .addField('Start Date',
                    manga.entry[0].start_date[0], true)
                .addField('End Date',
                    manga.entry[0].end_date[0], true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say('Error: No Results.');
        }
    }
};
