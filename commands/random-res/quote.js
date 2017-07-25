const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class QuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quote',
            group: 'random-res',
            memberName: 'quote',
            description: 'Responds with a random quote.',
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async run(msg) {
        const { body } = await snekfetch
            .get('https://api.forismatic.com/api/1.0/')
            .query({
                method: 'getQuote',
                lang: 'en',
                format: 'json'
            });
        const embed = new MessageEmbed()
            .setColor(0x9797FF)
            .setURL(body.quoteLink)
            .setAuthor(body.quoteAuthor)
            .setDescription(body.quoteText);
        return msg.embed(embed);
    }
};

