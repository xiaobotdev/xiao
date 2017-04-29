const { Command } = require('discord.js-commando');
const request = require('superagent');
const cheerio = require('cheerio');

module.exports = class NeopetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neopet',
            group: 'search',
            memberName: 'neopet',
            description: 'Gives a Neopet\'s image, searchable by name.',
            args: [{
                key: 'query',
                prompt: 'What pet would you like to get the image of?',
                type: 'string',
                parse: query => encodeURIComponent(query)
            }]
        });
    }

    async run(message, args) {
        const { query } = args;
        try {
            const { text } = await request
                .get(`http://www.sunnyneo.com/petimagefinder.php?name=${query}&size=5&mood=1`);
            const $ = cheerio.load(text);
            const link = $('textarea').first().text();
            if (!link.includes('cp'))
                return message.say('This is not a valid pet name.');
            return message.say(link);
        } catch (err) {
            return message.say('An Unknown Error Occurred.');
        }
    }
};
