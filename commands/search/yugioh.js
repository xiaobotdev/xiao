const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class YuGiOhCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'yugioh',
            group: 'search',
            memberName: 'yugioh',
            description: 'Gets info on a Yu-Gi-Oh! Card. (;yugioh Blue-Eyes White Dragon)',
            examples: [';yugioh Blue-Eyes White Dragon'],
            args: [{
                key: 'card',
                prompt: 'What card would you like to get data for?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let cardName = encodeURI(args.card);
        try {
            let response = await request
                .get(`http://yugiohprices.com/api/card_data/${cardName}`);
            let data = response.body.data;
            if (data.card_type === 'monster') {
                const embed = new Discord.RichEmbed()
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
            const embed = new Discord.RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(data.name)
                .setDescription(data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                    data.card_type, true);
            return message.embed(embed);
        }
        catch (err) {
            return message.say(":x: Error! Card not Found!\n:notepad_spiral: Note: This command is **extremely** sensitive to casing and dashes and whatnot. Type the *exact* card name to get data!");
        }
    }
};
