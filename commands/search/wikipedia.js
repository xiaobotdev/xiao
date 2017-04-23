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
            args: [{
                key: 'query',
                prompt: 'What would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { query } = args;
        try {
            const { body } = await request
                .get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${query}&exintro=&explaintext=&redirects=&formatversion=2`);
            const data = body.query.pages[0];
            const description = data.extract.substr(0, 2000).split('\n').join('\n\n');
            const embed = new RichEmbed()
                .setColor(0xE7E7E7)
                .setTitle(data.title)
                .setURL(`https://en.wikipedia.org/wiki/${query}`)
                .setAuthor('Wikipedia', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1122px-Wikipedia-logo-v2.svg.png')
                .setDescription(description);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Entry Not Found!');
        }
    }
};
