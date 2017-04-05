const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');
const config = require('../../config.json');

module.exports = class WattpadCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'wattpad',
            group: 'search',
            memberName: 'wattpad',
            description: 'Searches Wattpad for a specified book. (;wattpad Heroes of Dreamland)',
            examples: [';wattpad Heroes of Dreamland'],
            args: [{
                key: 'book',
                prompt: 'What book would you like to search for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const queryBook = args.book;
        try {
            const response = await request
                .get('https://api.wattpad.com:443/v4/stories')
                .set({
                    'Authorization': `Basic ${config.wattpadkey}`
                })
                .query({
                    query: queryBook,
                    limit: 1
                });
            const data = response.body.stories[0];
            const embed = new Discord.RichEmbed()
                .setColor(0xF89C34)
                .setAuthor('Wattpad', 'http://www.selfpubtoolbox.com/wp-content/uploads/2015/05/a6044fd3a88acd5043860484db972ca6.png')
                .setURL(data.url)
                .setTitle(data.title)
                .setDescription(data.description.substr(0, 1500))
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
        }
        catch (err) {
            return message.say(':x: Error! Book not Found!');
        }
    }
};
