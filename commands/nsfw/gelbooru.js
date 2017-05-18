const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { promisify } = require('tsubaki');
const xml = promisify(require('xml2js').parseString);

module.exports = class GelbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gelbooru',
            group: 'nsfw',
            memberName: 'gelbooru',
            description: 'Sends an image from Gelbooru, with query.',
            guildOnly: true,
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
        if (!msg.channel.nsfw) return msg.say('This Command can only be used in NSFW Channels.');
        if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
            return msg.say('This Command requires the `Attach Files` Permission.');
        const { query } = args;
        try {
            const { text } = await snekfetch
                .get('https://gelbooru.com/index.php')
                .query({
                    page: 'dapi',
                    s: 'post',
                    q: 'index',
                    tags: query,
                    limit: 1
                });
            const { posts } = await xml(text);
            if (!posts.$.count) throw new Error('No Results.');
            return msg.say(`Result for ${query}:`, { files: [`https:${posts.post[0].$.file_url}`] })
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
