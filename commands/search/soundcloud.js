const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class SoundCloudCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'soundcloud',
            aliases: [
                'cloudsound',
                'scloud',
                'csound'
            ],
            group: 'search',
            memberName: 'soundcloud',
            description: 'Searches SoundCloud for a song. (;soundcloud Turtle Dreams)',
            examples: [';soundcloud Turtle Dreams'],
            args: [{
                key: 'query',
                prompt: 'What do you want to search SoundCloud for?',
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
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://api.soundcloud.com/tracks?q=${query}&client_id=${process.env.SOUNDCLOUD_KEY}`);
            const data = body[0];
            const embed = new RichEmbed()
                .setColor(0xF15A22)
                .setAuthor(data.title, data.user.avatar_url)
                .setURL(data.permalink_url)
                .setThumbnail(data.artwork_url)
                .addField('**Link:**',
                    `[Here](${data.permalink_url})`)
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
            return message.say(':x: Error! No Results Found!');
        }
    }
};
