const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class IMDBCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'imdb',
            group: 'search',
            memberName: 'imdb',
            description: 'Searches IMDB for a specified movie.',
            args: [
                {
                    key: 'query',
                    prompt: 'What movie or TV Show would you like to search for?',
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
            const { body } = await snekfetch
                .get(`http://www.omdbapi.com/`)
                .query({
                    t: query,
                    plot: 'full'
                });
            if (body.Error) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0xDBA628)
                .setAuthor('IMDB', 'https://i.imgur.com/sXwwIQs.png')
                .setURL(`http://www.imdb.com/title/${body.imdbID}`)
                .setTitle(`${body.Title} (${body.imdbRating} Score)`)
                .setDescription(body.Plot.substr(0, 2000))
                .addField('Genres',
                    body.Genre)
                .addField('Year',
                    body.Year, true)
                .addField('Rated',
                    body.Rated, true)
                .addField('Runtime',
                    body.Runtime, true)
                .addField('Directors',
                    body.Director)
                .addField('Writers',
                    body.Writer)
                .addField('Actors',
                    body.Actors);
            return msg.embed(embed);
        } catch (err) {
            return msg.say('An Error Occurred. There were most likely no results.');
        }
    }
};
