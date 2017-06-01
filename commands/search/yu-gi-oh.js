const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class YuGiOhCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yu-gi-oh',
            group: 'search',
            memberName: 'yu-gi-oh',
            description: 'Gets info on a Yu-Gi-Oh! Card.',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    key: 'query',
                    prompt: 'What card would you like to get data for?',
                    type: 'string',
                    parse: (text) => encodeURIComponent(text)
                }
            ]
        });
    }

    async run(msg, args) {
        const { query } = args;
        const { body } = await snekfetch
            .get(`http://yugiohprices.com/api/card_data/${query}`);
        if (body.status === 'fail') return msg.say('No Results.');
        const embed = new RichEmbed()
            .setColor(0xBE5F1F)
            .setTitle(body.data.name)
            .setDescription(body.data.text)
            .setAuthor('Yu-Gi-Oh!', 'https://i.imgur.com/7gPm9Rr.png')
            .addField('❯ Card Type',
                body.data.card_type, true);
        if (body.data.card_type === 'monster') {
            embed
                .addField('❯ Type',
                    body.data.type, true)
                .addField('❯ Attribute',
                    body.data.family, true)
                .addField('❯ ATK',
                    body.data.atk, true)
                .addField('❯ DEF',
                    body.data.def, true)
                .addField('❯ Level',
                    body.data.level, true);
        }
        return msg.embed(embed);
    }
};
