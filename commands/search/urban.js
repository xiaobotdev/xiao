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
            args: [
                {
                    key: 'query',
                    prompt: 'What would you like to define?',
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
                .get(`http://api.urbandictionary.com/v0/define?term=${query}`);
            const embed = new RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                .setURL(body.list[0].permalink)
                .setTitle(body.list[0].word)
                .setDescription(body.list[0].definition.substr(0, 2000))
                .addField('**Example:**',
                    body.list[0].example.substr(0, 2000) || 'None');
            return msg.embed(embed);
        } catch (err) {
            return msg.say('An Error Occurred. The word may not have been found.');
        }
    }
};
