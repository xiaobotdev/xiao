const { Command } = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class GoogleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'google',
            aliases: [
                'search'
            ],
            group: 'search',
            memberName: 'google',
            description: 'Searches Google. (;google Cat)',
            examples: [';google Cat'],
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const query = args.query;
        const msg = await message.say('Searching...');
        try {
            const response = await request
                .get(`https://www.google.com/search`)
                .query({
                    q: query
                });
            const $ = cheerio.load(response.text);
            let href = $('.r').first().find('a').first().attr('href');
            href = querystring.parse(href.replace('/url?', ''));
            return msg.edit(href.q);
        }
        catch (err) {
            return msg.edit(':x: Error! No Results Found!');
        }
    }
};
