const commando = require('discord.js-commando');
const Discord = require('discord.js');
const config = require('../../config.json');
const osu = require('osu')(config.osukey);

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
        osu.get_user({
            "u": usernametosearch,
            "type": 'string'
        }, function(result) {
            if(result[0] === undefined) {
                message.channel.sendMessage(":x: Error! User not found!");
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0xFF66AA)
                .setAuthor('osu!', 'http://vignette3.wikia.nocookie.net/osugame/images/c/c9/Logo.png/revision/latest?cb=20151219073209')
                .setURL('https://osu.ppy.sh/')
                .addField('**Username:**',
                result[0].username, true)
                .addField('**ID:**',
                result[0].user_id, true)
                .addField('**Level:**',
                result[0].level, true)
                .addField('**Accuracy**',
                result[0].accuracy, true)
                .addField('**Rank:**',
                result[0].pp_rank, true)
                .addField('**Play Count:**',
                result[0].playcount, true)
                .addField('**Country:**',
                result[0].country, true)
                .addField('**Ranked Score:**',
                result[0].ranked_score, true)
                .addField('**Total Score:**',
                result[0].total_score, true)
                .addField('**SS:**',
                result[0].count_rank_ss, true)
                .addField('**S:**',
                result[0].count_rank_s, true)
                .addField('**A:**',
                result[0].count_rank_a, true);
                message.channel.sendEmbed(embed).catch(console.error);
            }
        });
    }
}

module.exports = OsuCommand;