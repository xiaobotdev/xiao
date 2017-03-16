const commando = require('discord.js-commando');
const Discord = require('discord.js');
const imdb = require('imdb-api');

class IMDBCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'imdb', 
            group: 'search',
            memberName: 'imdb',
            description: 'Searches IMDB for a specified movie. (;imdb How to Train Your Dragon)',
            examples: [';imdb How to Train Your Dragon']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let querymovie = message.content.split(" ").slice(1).join(" ");
        let movie;
        imdb.getReq({ name: querymovie }, (err, things) => {
            movie = things;
            if(movie === undefined) {
                message.channel.send(":x: Error! Movie not found!");
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xDBA628)
                .setAuthor('IMDB', 'http://static.wixstatic.com/media/c65cbf_31901b544fe24f1890134553bf40c8be.png')
                .setURL(movie.imdburl)
                .setTitle(movie.title + ' (' + movie.rating + ' Score)')
                .setDescription(movie.plot.substr(0, 1500) + " [Read the Rest Here!](" + movie.imdburl + ")")
                .addField('**Genres:**',
                movie.genres)
                .addField('**Year:**',
                movie.year, true)
                .addField('**Rated:**',
                movie.rated, true)
                .addField('**Runtime:**',
                movie.runtime, true)
                .addField('**Directors:**',
                movie.director, true)
                .addField('**Writers:**',
                movie.writer, true)
                .addField('**Actors:**',
                movie.actors, true);
                message.channel.sendEmbed(embed).catch(console.error);            
            }
        });
    }
}

module.exports = IMDBCommand;