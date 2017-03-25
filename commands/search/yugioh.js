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
            if (response.body.data.card_type === 'monster') {
                const embed = new Discord.RichEmbed()
                    .setColor(0xBE5F1F)
                    .setTitle(response.body.data.name)
                    .setDescription(response.body.data.text)
                    .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                    .addField('**Card Type:**',
                        response.body.data.card_type, true)
                    .addField('**Species:**',
                        response.body.data.type, true)
                    .addField('**Attribute:**',
                        response.body.data.family, true)
                    .addField('**ATK:**',
                        response.body.data.atk, true)
                    .addField('**DEF:**',
                        response.body.data.def, true)
                    .addField('**Level:**',
                        response.body.data.level, true);
                return message.channel.sendEmbed(embed);
            }
            const embed = new Discord.RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(response.body.data.name)
                .setDescription(response.body.data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                    response.body.data.card_type, true);
            return message.channel.sendEmbed(embed);
        }
        catch (err) {
            return message.channel.send(":x: Error! Card not Found!\n:notepad_spiral: Note: This command is **extremely** sensitive to casing and dashes and whatnot. Type the *exact* card name to get data!");
        }
    }
};
