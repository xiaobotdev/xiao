const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class YuGiOhCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'yugioh', 
            group: 'search',
            memberName: 'yugioh',
            description: 'Gets info on a Yu-Gi-Oh! Card. (;yugioh Blue-Eyes White Dragon)',
            examples: [';yugioh Blue-Eyes White Dragon']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let cardname = message.content.split(" ").slice(1).join("%20");
        const options = {
	        method: 'GET',
	        uri: 'http://yugiohprices.com/api/card_data/' + cardname,
  	        json: true
        }
        request(options).then(function (response) {
            if(response.data.card_type === 'monster') {
                const embed = new Discord.RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(response.data.name)
                .setDescription(response.data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                response.data.card_type, true)
                .addField('**Species:**',
                response.data.type, true)
                .addField('**Attribute:**',
                response.data.family, true)
                .addField('**ATK:**',
                response.data.atk, true)
                .addField('**DEF:**',
                response.data.def, true)
                .addField('**Level:**',
                response.data.level, true);
                message.channel.sendEmbed(embed).catch(console.error);
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xBE5F1F)
                .setTitle(response.data.name)
                .setDescription(response.data.text)
                .setAuthor('Yu-Gi-Oh!', 'http://vignette3.wikia.nocookie.net/yugioh/images/1/10/Back-TF-EN-VG.png/revision/latest?cb=20120824043558')
                .addField('**Card Type:**',
                response.data.card_type, true);
                message.channel.sendEmbed(embed).catch(console.error);
            }
        }).catch(function (err) {
            message.channel.send(":x: Error! Card not Found!\n:notepad_spiral: Note: This command is **extremely** sensitive to casing and dashes and whatnot. Type the *exact* card name to get data!");
        });
    }
}

module.exports = YuGiOhCommand;