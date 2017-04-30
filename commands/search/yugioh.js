const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const request = require('superagent');

module.exports = class YuGiOhCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'yugioh',
            group: 'search',
            memberName: 'yugioh',
            description: 'Gets info on a Yu-Gi-Oh! Card.',
            args: [{
                key: 'query',
                prompt: 'What card would you like to get data for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { query } = args;
        try {
            const { body } = await request
                .get(`http://yugiohprices.com/api/card_data/${query}`);
            if (body.data.card_type === 'monster') {
                const embed = new RichEmbed()
                    .setColor(0xBE5F1F)
                    .setTitle(body.data.name)
                    .setDescription(body.data.text)
                    .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                    .addField('**Card Type:**',
                        'Monster', true)
                    .addField('**Type:**',
                        body.data.type, true)
                    .addField('**Attribute:**',
                        body.data.family, true)
                    .addField('**ATK:**',
                        body.data.atk, true)
                    .addField('**DEF:**',
                        body.data.def, true)
                    .addField('**Level:**',
                        body.data.level, true);
                return msg.embed(embed);
            }
            const embed = new RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(body.data.name)
                .setDescription(body.data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                    body.data.card_type, true);
            return msg.embed(embed);
        } catch (err) {
            return msg.say('An Error Occurred. The card may not have been found.');
        }
    }
};
