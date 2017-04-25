const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class UrbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'search',
            memberName: 'urban',
            description: 'Searches Urban Dictionary for a word.',
            args: [{
                key: 'word',
                prompt: 'What would you like to define?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS'))
                return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        const { word } = args;
        try {
            const { body } = await request
                .get(`http://api.urbandictionary.com/v0/define?term=${word}`);
            const data = body.list[0];
            const embed = new RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription(data.definition.substr(0, 2000))
                .addField('**Example:**',
                    data.example.substr(0, 2000) || 'None');
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Word not found!');
        }
    }
};
