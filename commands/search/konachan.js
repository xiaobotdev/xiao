const { Command } = require('discord.js-commando');
const request = require('superagent');

module.exports = class KonachanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'konachan',
            group: 'search',
            memberName: 'konachan',
            description: 'Sends a random (Possibly NSFW!) anime image from Konachan, with optional query.',
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        if (!msg.channel.nsfw) return msg.say('This Command can only be used in NSFW Channels.');
        if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
            return msg.say('This Command requires the `Attach Files` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://konachan.net/post.json?tags=${query ? `${query}%20` : ''}order:random&limit=1`);
            if (!body.length) throw new Error('No Results.');
            return msg.channel.send(query ? `Result for ${query}:` : 'Random Image:', { files: [`https:${body[0].file_url}`] })
                .catch(err => msg.say(err));
        } catch (err) {
            return msg.say(err);
        }
    }
};
