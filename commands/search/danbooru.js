const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class DanbooruCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'danbooru',
            group: 'search',
            memberName: 'danbooru',
            description: 'Sends an image from Danbooru, with optional query.',
            guildOnly: true,
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
        if (!msg.channel.nsfw) return msg.say('This Command can only be used in NSFW Channels.');
        if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES'))
            return msg.say('This Command requires the `Attach Files` Permission.');
        const { query } = args;
        try {
            const { body } = await snekfetch
                .get('https://danbooru.donmai.us/posts.json')
                .query({
                    tags: `${query ? `${query} ` : ''}order:random`,
                    limit: 1
                });
            if (!body.length) throw new Error('No Results.');
            return msg.say(query ? `Result for ${query}:` : 'Random Image:', { files: [`https://danbooru.donmai.us${body[0].file_url}`] })
                .catch(err => msg.say(`${err.name}: ${err.message}`));
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
