const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');

module.exports = class DanbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'danbooru',
            group: 'search',
            memberName: 'danbooru',
            description: 'Sends an image from Danbooru, with optional query.',
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
            .get('https://danbooru.donmai.us/posts.json')
            .query({
                tags: `${query ? `${query} ` : ''}order:random`,
                limit: 1
            });
        if (!body.length || !body[0].file_url) return msg.say('No Results');
        return msg.say(stripIndents`
            ${query ? `Result for ${query}:` : 'Random Image:'}
            https://danbooru.donmai.us${body[0].file_url}
        `);
    }
};
