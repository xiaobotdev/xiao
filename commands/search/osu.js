const commando = require('discord.js-commando');
const Discord = require('discord.js');
const config = require('../../config.json');
const request = require('request-promise');

class OsuCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'osu', 
            group: 'search',
            memberName: 'osu',
            description: 'Searches Osu user data. (;osu dragonfire535)',
            examples: [';osu dragonfire535']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let usernametosearch = message.content.split(" ").slice(1).join(" ");
        const options = {
	        method: 'GET',
	        uri: 'https://osu.ppy.sh/api/get_user',
	        qs: {
    	        k: config.osukey,
                u: usernametosearch,
                type: "string"
  	        },
            headers: {
                'User-Agent': 'XiaoBot - dragonfire535 (http://dragonfire535.tk)'
            },
  	        json: true
        }
        request(options).then(function (response) {
            if(response[0] === undefined) {
                message.channel.sendMessage(":x: Error! User not found!");
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xFF66AA)
                .setAuthor('osu!', 'http://vignette3.wikia.nocookie.net/osugame/images/c/c9/Logo.png/revision/latest?cb=20151219073209')
                .setURL('https://osu.ppy.sh/')
                .addField('**Username:**',
                response[0].username, true)
                .addField('**ID:**',
                response[0].user_id, true)
                .addField('**Level:**',
                response[0].level, true)
                .addField('**Accuracy**',
                response[0].accuracy, true)
                .addField('**Rank:**',
                response[0].pp_rank, true)
                .addField('**Play Count:**',
                response[0].playcount, true)
                .addField('**Country:**',
                response[0].country, true)
                .addField('**Ranked Score:**',
                response[0].ranked_score, true)
                .addField('**Total Score:**',
                response[0].total_score, true)
                .addField('**SS:**',
                response[0].count_rank_ss, true)
                .addField('**S:**',
                response[0].count_rank_s, true)
                .addField('**A:**',
                response[0].count_rank_a, true);
                message.channel.sendEmbed(embed).catch(console.error);
            }
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! User not Found!");
        });
    }
}

module.exports = OsuCommand;