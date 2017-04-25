const { Command } = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class GoogleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'google',
            group: 'search',
            memberName: 'google',
            description: 'Searches Google.',
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        const { query } = args;
        const msg = await message.say('Searching...');
        try {
            const { text } = await request
                .get(`https://www.google.com/search?q=${query}`);
            const $ = cheerio.load(text);
            let href = $('.r').first().find('a').first().attr('href');
            href = querystring.parse(href.replace('/url?', ''));
            return msg.edit(href.q);
        } catch (err) {
            return msg.edit(':x: Error! No Results Found!');
        }
    }
};
