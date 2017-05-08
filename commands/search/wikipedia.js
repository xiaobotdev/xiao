const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WikipediaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wikipedia',
            group: 'search',
            memberName: 'wikipedia',
            description: 'Searches Wikipedia for something.',
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to search for?',
                    type: 'string',
                    parse: text => encodeURIComponent(text)
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
            const { body } = await request
                .get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${query}&exintro=&explaintext=&redirects=&formatversion=2`);
            if (body.query.pages[0].missing) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0xE7E7E7)
                .setTitle(body.query.pages[0].title)
                .setURL(`https://en.wikipedia.org/wiki/${query}`)
                .setAuthor('Wikipedia', 'https://i.imgur.com/a4eeEhh.png')
                .setDescription(body.query.pages[0].extract.substr(0, 2000).replace(/[\n]/g, '\n\n'));
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`An Error Occurred: ${err}`);
        }
    }
};
