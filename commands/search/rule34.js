const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const xml = promisifyAll(require('xml2js'));

module.exports = class Rule34Command extends Command {
    constructor(client) {
        super(client, {
            name: 'rule34',
            group: 'search',
            memberName: 'rule34',
            description: 'Sends an image from Rule34, with query.',
            nsfw: true,
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
        const { text } = await snekfetch
            .get('https://rule34.xxx/index.php')
            .query({
                page: 'dapi',
                s: 'post',
                q: 'index',
                tags: query,
                limit: 1
            });
        const { posts } = await xml.parseStringAsync(text);
        if (posts.$.count === '0') return msg.say('No Results.');
        return msg.say(stripIndents`
            Result for ${query}:
            https:${posts.post[0].$.file_url}
        `);
    }
};
