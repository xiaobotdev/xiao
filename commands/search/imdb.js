const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class IMDBCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'imdb',
            aliases: [
                'movie',
                'tvshow',
                'film',
                'omdb'
            ],
            group: 'search',
            memberName: 'imdb',
            description: 'Searches IMDB for a specified movie. (;imdb How to Train Your Dragon)',
            examples: [';imdb How to Train Your Dragon'],
            args: [{
                key: 'movie',
                prompt: 'What movie or TV Show would you like to search for?',
                type: 'string',
                parse: text => {
                    return encodeURIComponent(text);
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { movie } = args;
        try {
            const { body } = await request
                .get(`http://www.omdbapi.com/?t=${movie}&plot=full`);
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
            return message.say(':x: Error! Movie not found!');
        }
    }
};
