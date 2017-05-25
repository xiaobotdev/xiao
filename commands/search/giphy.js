const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GIPHY_KEY } = process.env;

module.exports = class GiphyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'giphy',
            group: 'search',
            memberName: 'giphy',
            description: 'Searches for GIFs with Giphy.',
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
            if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
                return msg.say('This Command requires the `Attach Files` Permission.');
        const { query } = args;
        try {
            const { body } = await snekfetch
                .get('http://api.giphy.com/v1/gifs/search')
                .query({
                    q: query,
                    api_key: GIPHY_KEY,
                    rating: msg.channel.nsfw ? 'r' : 'pg'
                });
            if (!body.data.length) throw new Error('No Results.');
            const random = Math.floor(Math.random() * body.data.length);
            return msg.say({ files: [body.data[random].images.original.url] })
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
