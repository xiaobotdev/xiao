const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class IMDBCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let queryMovie = args.movie;
        try {
            let response = await request
                .get(`http://www.omdbapi.com/`)
                .query({
                    t: queryMovie,
                    plot: 'full'
                });
            let data = response.body;
            const embed = new Discord.RichEmbed()
                .setColor(0xDBA628)
                .setAuthor('IMDB', 'http://static.wixstatic.com/media/c65cbf_31901b544fe24f1890134553bf40c8be.png')
                .setURL(`http://www.imdb.com/title/${data.imdbID}`)
                .setTitle(`${data.Title} (${data.imdbRating} Score)`)
                .setDescription(`${data.Plot.substr(0, 1500)} [Read the Rest Here!](http://www.imdb.com/title/${data.imdbID})`)
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
        }
        catch (err) {
            return message.say(':x: Error! Movie not found!');
        }
    }
};
