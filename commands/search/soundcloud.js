const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { SOUNDCLOUD_KEY } = process.env;

module.exports = class SoundCloudCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundcloud',
            group: 'search',
            memberName: 'soundcloud',
            description: 'Searches SoundCloud for a song.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What do you want to search SoundCloud for?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get('https://api.soundcloud.com/tracks')
            .query({
                q: query,
                client_id: SOUNDCLOUD_KEY
            });
        if (!body.length) return msg.say('No Results.');
        const embed = new RichEmbed()
            .setColor(0xF15A22)
            .setAuthor('SoundCloud', 'https://i.imgur.com/lFIz7RU.png')
            .setTitle(body[0].title)
            .setURL(body[0].permalink_url)
            .setThumbnail(body[0].artwork_url)
            .addField('❯ Artist',
                body[0].user.username)
            .addField('❯ Download Count',
                body[0].download_count, true)
            .addField('❯ Comment Count',
                body[0].comment_count, true)
            .addField('❯ Playback Count',
                body[0].playback_count, true)
            .addField('❯ Favorited Count',
                body[0].favoritings_count, true);
        return msg.embed(embed);
    }
};
