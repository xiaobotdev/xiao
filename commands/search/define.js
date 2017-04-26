const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class DefineCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'define',
            group: 'search',
            memberName: 'define',
            description: 'Defines a word.',
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
            if (!message.channel.permissionsFor(this.client.user).permissions.has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
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
            return message.say('An Error Occurred. The word may not have been found.');
        }
    }
};
