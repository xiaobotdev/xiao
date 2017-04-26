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
                key: 'card',
                prompt: 'What card would you like to get data for?',
                type: 'string',
                parse: text => encodeURIComponent(text)
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm')
            if (!message.channel.permissionsFor(this.client.user).permissions.has('EMBED_LINKS'))
                return message.say('This Command requires the `Embed Links` Permission.');
        const { card } = args;
        try {
            const { body } = await request
                .get(`http://yugiohprices.com/api/card_data/${card}`);
            const data = body.data;
            if (data.card_type === 'monster') {
                const embed = new RichEmbed()
                    .setColor(0xBE5F1F)
                    .setTitle(data.name)
                    .setDescription(data.text)
                    .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                    .addField('**Card Type:**',
                        'Monster', true)
                    .addField('**Type:**',
                        data.type, true)
                    .addField('**Attribute:**',
                        data.family, true)
                    .addField('**ATK:**',
                        data.atk, true)
                    .addField('**DEF:**',
                        data.def, true)
                    .addField('**Level:**',
                        data.level, true);
                return message.embed(embed);
            }
            const embed = new RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(data.name)
                .setDescription(data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                    data.card_type, true);
            return message.embed(embed);
        } catch (err) {
            return message.say('An Error Occurred. The card may not have been found.');
        }
    }
};
