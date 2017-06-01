const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class KonachanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'konachan',
            group: 'search',
            memberName: 'konachan',
            description: 'Sends an image from Konachan, with optional query.',
            nsfw: true,
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
        const { query } = args;
        const { body } = await snekfetch
            .get('https://konachan.net/post.json')
            .query({
                tags: `${query ? `${query} ` : ''}order:random`,
                limit: 1
            });
        if (!body.length) return msg.say('No Results.');
        return msg.say(stripIndents`
            ${query ? `Result for ${query}:` : 'Random Image:'}
            https:${body[0].file_url}
        `);
    }
};
