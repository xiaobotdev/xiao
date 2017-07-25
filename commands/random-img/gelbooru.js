const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const snekfetch = require('snekfetch');
const { promisifyAll } = require('tsubaki');
const xml = promisifyAll(require('xml2js'));

module.exports = class GelbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gelbooru',
            group: 'random-img',
            memberName: 'gelbooru',
            description: 'Searches Gelbooru with optional query.',
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
        const { text } = await snekfetch
            .get('https://gelbooru.com/index.php')
            .query({
                page: 'dapi',
                s: 'post',
                q: 'index',
                tags: query,
                limit: 200
            });
        const { posts } = await xml.parseStringAsync(text);
        if (posts.$.count === '0') return msg.say('No Results.');
        return msg.say(stripIndents`
            Result for ${query}:
            https:${posts.post[Math.floor(Math.random * posts.post.length)].$.file_url}
        `);
    }
};
