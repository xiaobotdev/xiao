const commando = require('discord.js-commando');
const Discord = require('discord.js');
const urban = require('urban');

class UrbanDictionary extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'urban', 
            group: 'search',
            memberName: 'urban',
            description: 'Searches Urban Dictionary. (;urban Cat)',
            examples: [';urban Cat']
        });
    }
 
    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let wordtodefine = message.content.split(" ").slice(1).join(" ");
        urban(wordtodefine).first(function(json) {
            if(json === undefined) {
                message.channel.send(":x: Error! Word not found!");
            } else if(json.definition === '') {
                message.channel.send(":x: Error! Word has no definition!");
            } else if(json.example !== '') {
                const embed = new Discord.RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                .setURL(json.permalink)
                .setTitle(json.word)
                .setDescription(json.definition.substr(0, 1900) + '... [Read the Rest Here!](' + json.permalink + ')')
                .addField('**Example:**',
                json.example.substr(0, 1900));
                message.channel.sendEmbed(embed).catch(console.error);
            } else {
                const embed = new Discord.RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                .setURL(json.permalink)
                .setTitle(json.word)
                .setDescription(json.definition.substr(0, 1900) + '... [Read the Rest Here!](' + json.permalink + ')');
                message.channel.sendEmbed(embed).catch(console.error);
            }
        });
    }
}

module.exports = UrbanDictionary;