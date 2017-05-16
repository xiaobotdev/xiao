const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = class GoogleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'google',
            group: 'search',
            memberName: 'google',
            description: 'Searches Google.',
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
        const { query } = args;
        const message = await msg.say('Searching...');
        try {
            const { text } = await snekfetch
                .get('https://www.google.com/search')
                .query({
                    q: query
                });
            const $ = cheerio.load(text);
            let href = $('.r').first().find('a').first().attr('href');
            if (!href) throw new Error('No Results.');
            href = querystring.parse(href.replace('/url?', ''));
            return message.edit(href.q);
        } catch (err) {
            return message.edit(`${err.name}: ${err.message}`);
        }
    }
};
