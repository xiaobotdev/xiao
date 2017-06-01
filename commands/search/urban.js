const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class UrbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'search',
            memberName: 'urban',
            description: 'Searches Urban Dictionary for a word.',
            clientPermissions: ['EMBED_LINKS'],
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
        const { query } = args;
        const { body } = await snekfetch
            .get('http://api.urbandictionary.com/v0/define')
            .query({ term: query });
        if (!body.list.length) return msg.say('No Results.');
        const embed = new RichEmbed()
            .setColor(0x32a8f0)
            .setAuthor('Urban Dictionary', 'https://i.imgur.com/fzFuuL7.png')
            .setURL(body.list[0].permalink)
            .setTitle(body.list[0].word)
            .setDescription(body.list[0].definition.substr(0, 2000))
            .addField('❯ Example',
                body.list[0].example.substr(0, 2000) || 'None');
        return msg.embed(embed);
    }
};
