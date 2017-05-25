const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class BulbapediaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulbapedia',
            aliases: ['bulbagarden'],
            group: 'search',
            memberName: 'bulbapedia',
            description: 'Searches Bulbapedia for something.',
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
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await snekfetch
                .get('http://bulbapedia.bulbagarden.net/w/api.php')
                .query({
                    action: 'query',
                    prop: 'extracts',
                    format: 'json',
                    titles: query,
                    exintro: '',
                    explaintext: '',
                    redirects: '',
                    formatversion: 2
                });
            if (body.query.pages[0].missing) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0x3E7614)
                .setTitle(body.query.pages[0].title)
                .setAuthor('Bulbapedia', 'https://i.imgur.com/09eYo5T.png')
                .setDescription(body.query.pages[0].extract.substr(0, 2000).replace(/[\n]/g, '\n\n'));
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
