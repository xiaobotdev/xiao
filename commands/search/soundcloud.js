const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class SoundCloudCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundcloud',
            group: 'search',
            memberName: 'soundcloud',
            description: 'Searches SoundCloud for a song.',
            args: [{
                key: 'query',
                prompt: 'What do you want to search SoundCloud for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://api.soundcloud.com/tracks?q=${query}&client_id=${process.env.SOUNDCLOUD_KEY}`);
            const data = body[0];
            const embed = new RichEmbed()
                .setColor(0xF15A22)
                .setAuthor(data.title, 'http://icons.iconarchive.com/icons/danleech/simple/1024/soundcloud-icon.png')
                .setURL(data.permalink_url)
                .setThumbnail(data.artwork_url)
                .addField('**Artist:**',
                    data.user.username)
                .addField('**Download Count:**',
                    data.download_count, true)
                .addField('**Comment Count**',
                    data.comment_count, true)
                .addField('**Playback Count:**',
                    data.playback_count, true)
                .addField('**Favorited Count:**',
                    data.favoritings_count, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The song may not have been found.');
        }
    }
};
