const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class DefineCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'define',
            aliases: [
                'definition',
                'defineword',
                'dictionary',
                'wordnik'
            ],
            group: 'search',
            memberName: 'define',
            description: 'Defines a word.',
            args: [{
                key: 'word',
                prompt: 'What would you like to define?',
                type: 'string',
                parse: text => {
                    return encodeURIComponent(text);
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
            if (!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return message.say(':x: Error! I don\'t have the Embed Links Permission!');
        }
        const { word } = args;
        try {
            const { body } = await request
                .get(`http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&api_key=${process.env.WORDNIK_KEY}`);
            const data = body[0];
            const embed = new RichEmbed()
                .setColor(0x9797FF)
                .setTitle(data.word)
                .setDescription(data.text);
            return message.embed(embed);
        } catch (err) {
            return message.say(':x: Error! Word not Found!');
        }
    }
};
