const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class YouTubeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'youtube',
            group: 'search',
            memberName: 'youtube',
            description: 'Searches YouTube for a video.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
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
                .get('https://www.googleapis.com/youtube/v3/search')
                .query({
                    part: 'snippet',
                    type: 'video',
                    maxResults: 1,
                    q: query,
                    key: GOOGLE_KEY
                });
            if (!body.items.length) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0xDD2825)
                .setTitle(body.items[0].snippet.title)
                .setDescription(body.items[0].snippet.description)
                .setAuthor(`YouTube - ${body.items[0].snippet.channelTitle}`, 'https://i.imgur.com/hkUafwu.png')
                .setURL(`https://www.youtube.com/watch?v=${body.items[0].id.videoId}`)
                .setThumbnail(body.items[0].snippet.thumbnails.default.url);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(err);
        }
    }
};
