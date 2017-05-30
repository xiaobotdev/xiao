const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class RedditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            group: 'search',
            memberName: 'reddit',
            description: 'Gets a random post from a subreddit.',
            args: [
                {
                    key: 'subreddit',
                    prompt: 'What subreddit should the post come from?',
                    type: 'string',
                    parse: query => encodeURIComponent(query)
                }
            ]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { subreddit } = args;
        try {
            const { body } = await snekfetch
                .get(``)
                .query({
                    limit: 1,
                    includeRelated: false,
                    useCanonical: false,
                    api_key: WORDNIK_KEY
                });
            if (!body.length) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setTitle(body[0].word)
                .setDescription(body[0].text);
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
