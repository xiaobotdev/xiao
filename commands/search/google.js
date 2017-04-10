const commando = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class GoogleCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
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
        const thingToSearch = args.query;
        const searchMsg = await message.say('Searching...');
        try {
            const response = await request
                .get(`https://www.google.com/search`)
                .query({
                    q: thingToSearch
                })
                .set({
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.138 Safari/537.36 Vivaldi/1.8.770.54'
                });
            const $ = cheerio.load(response.text);
            let href = $('.r').first().find('a').first().attr('href');
            href = querystring.parse(href.replace('/url?', ''));
            return searchMsg.edit(href.q);
        }
        catch (err) {
            return searchMsg.edit(':x: Error! No Results Found!');
        }
    }
};
