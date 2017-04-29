const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class IMDBCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'imdb',
            group: 'search',
            memberName: 'imdb',
            description: 'Searches IMDB for a specified movie.',
            args: [{
                key: 'query',
                prompt: 'What movie or TV Show would you like to search for?',
                type: 'string',
                parse: query => encodeURIComponent(query)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`http://www.omdbapi.com/?t=${query}&plot=full`);
            const embed = new RichEmbed()
                .setColor(0xDBA628)
                .setAuthor('IMDB', 'http://static.wixstatic.com/media/c65cbf_31901b544fe24f1890134553bf40c8be.png')
                .setURL(`http://www.imdb.com/title/${body.imdbID}`)
                .setTitle(`${body.Title} (${body.imdbRating} Score)`)
                .setDescription(body.Plot.substr(0, 2000))
                .addField('**Genres:**',
                    body.Genre)
                .addField('**Year:**',
                    body.Year, true)
                .addField('**Rated:**',
                    body.Rated, true)
                .addField('**Runtime:**',
                    body.Runtime, true)
                .addField('**Directors:**',
                    body.Director)
                .addField('**Writers:**',
                    body.Writer)
                .addField('**Actors:**',
                    body.Actors);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The film may not have been found.');
        }
    }
};
