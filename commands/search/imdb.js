const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class IMDBCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'imdb',
            aliases: [
                'movie',
                'tvshow',
                'film'
            ],
            group: 'search',
            memberName: 'imdb',
            description: 'Searches IMDB for a specified movie. (;imdb How to Train Your Dragon)',
            examples: [';imdb How to Train Your Dragon'],
            args: [{
                key: 'movie',
                prompt: 'What movie or TV Show would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const movie = encodeURIComponent(args.movie);
        try {
            const response = await snekfetch
                .get(`http://www.omdbapi.com/?t=${movie}&plot=full`);
            const data = response.body;
            const embed = new RichEmbed()
                .setColor(0xDBA628)
                .setAuthor('IMDB', 'http://static.wixstatic.com/media/c65cbf_31901b544fe24f1890134553bf40c8be.png')
                .setURL(`http://www.imdb.com/title/${data.imdbID}`)
                .setTitle(`${data.Title} (${data.imdbRating} Score)`)
                .setDescription(data.Plot.substr(0, 1900))
                .addField('**Genres:**',
                    data.Genre)
                .addField('**Year:**',
                    data.Year, true)
                .addField('**Rated:**',
                    data.Rated, true)
                .addField('**Runtime:**',
                    data.Runtime, true)
                .addField('**Directors:**',
                    data.Director)
                .addField('**Writers:**',
                    data.Writer)
                .addField('**Actors:**',
                    data.Actors);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Movie not found!');
        }
    }
};
