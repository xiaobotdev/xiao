const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

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
                .get('http://api.urbandictionary.com/v0/define')
                .query({
                    term: query
                });
            if (!body.list.length) throw new Error('No Results.');
            const embed = new RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'https://i.imgur.com/fzFuuL7.png')
                .setURL(body.list[0].permalink)
                .setTitle(body.list[0].word)
                .setDescription(body.list[0].definition.substr(0, 2000))
                .addField('Example',
                    body.list[0].example.substr(0, 2000) || 'None');
            return msg.embed(embed);
        } catch (err) {
            return msg.say(`${err.name}: ${err.message}`);
        }
    }
};
