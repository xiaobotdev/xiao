const commando = require('discord.js-commando');
const Discord = require('discord.js');
const urban = require('urban');

class UrbanDictionary extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'urban', 
            group: 'response',
            memberName: 'urban',
            description: 'Searches Urban Dictionary. (;urban Cat)',
            examples: [';urban Cat']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let wordtodefine = message.content.split(" ").slice(1).join(" ");
        urban(wordtodefine).first(function(json) {
            if(json === undefined) {
                message.reply(":x: Error! Word not found!");
            } else if(json.definition === '') {
                message.reply(":x: Error! Word has no definition!");
            } else if(json.example === '') {
                const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor('Urban Dictionary', 'https://lh3.googleusercontent.com/4hpSJ4pAfwRUg-RElZ2QXNh_pV01Z96iJGT2BFuk_RRsNc-AVY7cZhbN2g1zWII9PBQ=w170', json.permalink)
                .setDescription(json.word)
                .addField('Definition:',
                json.definition);
                message.channel.sendEmbed(embed).catch(console.error);       
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0x0000FF)
                .setAuthor('Urban Dictionary', 'https://lh3.googleusercontent.com/4hpSJ4pAfwRUg-RElZ2QXNh_pV01Z96iJGT2BFuk_RRsNc-AVY7cZhbN2g1zWII9PBQ=w170', json.permalink)
                .setDescription(json.word)
                .addField('Definition:',
                json.definition)
                .addField('Example:',
                json.example);
                message.channel.sendEmbed(embed).catch(console.error);
            }
        });
    }
}

module.exports = UrbanDictionary;