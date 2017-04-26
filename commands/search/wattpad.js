const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class WattpadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'wattpad',
            group: 'search',
            memberName: 'wattpad',
            description: 'Searches Wattpad for a book.',
            args: [{
                key: 'book',
                prompt: 'What book would you like to search for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).permissions.has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { book } = args;
        try {
            const { body } = await request
                .get(`https://api.wattpad.com:443/v4/stories?query=${book}&limit=1`)
                .set({
                    'Authorization': `Basic ${process.env.WATTPAD_KEY}`
                });
            const data = body.stories[0];
            const embed = new RichEmbed()
                .setColor(0xF89C34)
                .setAuthor('Wattpad', 'http://www.selfpubtoolbox.com/wp-content/uploads/2015/05/a6044fd3a88acd5043860484db972ca6.png')
                .setURL(data.url)
                .setTitle(data.title)
                .setDescription(data.description.substr(0, 2000))
                .addField('**Author:**',
                    data.user, true)
                .addField('**Parts:**',
                    data.numParts, true)
                .addField('**Created On:**',
                    data.createDate, true)
                .addField('**Votes:**',
                    data.voteCount, true)
                .addField('**Reads:**',
                    data.readCount, true)
                .addField('**Comments:**',
                    data.commentCount, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The book may not have been found.');
        }
    }
};
