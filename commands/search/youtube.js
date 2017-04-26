const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class YouTubeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'youtube',
            group: 'search',
            memberName: 'youtube',
            description: 'Searches YouTube for a video.',
            args: [{
                key: 'video',
                prompt: 'What would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { video } = args;
        try {
            const { body } = await request
                .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${video}&key=${process.env.GOOGLE_KEY}`);
            const data = body.items[0];
            const embed = new RichEmbed()
                .setColor(0xDD2825)
                .setTitle(data.snippet.title)
                .setDescription(data.snippet.description)
                .setAuthor(`YouTube - ${data.snippet.channelTitle}`, 'https://cdn3.iconfinder.com/data/icons/social-icons-5/607/YouTube_Play.png')
                .setURL(`https://www.youtube.com/watch?v=${data.id.videoId}`)
                .setThumbnail(data.snippet.thumbnails.default.url);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The video may not have been found.');
        }
    }
};
