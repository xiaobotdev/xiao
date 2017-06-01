const Command = require('../../structures/Command');
const snekfetch = require('snekfetch');
const cheerio = require('cheerio');

module.exports = class NeopetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'neopet',
            group: 'search',
            memberName: 'neopet',
            description: 'Gives a Neopet\'s image, searchable by name.',
            args: [
                {
                    key: 'query',
                    prompt: 'What pet would you like to get the image of?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { text } = await snekfetch
            .get('http://www.sunnyneo.com/petimagefinder.php')
            .query({
                name: query,
                size: 5,
                mood: 1
            });
        const $ = cheerio.load(text);
        const link = $('textarea').first().text();
        if (!link.includes('cp')) return msg.say('Invalid Pet Name.');
        return msg.say(link);
    }
};
