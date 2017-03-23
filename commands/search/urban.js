const commando = require('discord.js-commando');
const Discord = require('discord.js');
const urban = require('urban');

module.exports = class UrbanDictionary extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'urban',
            aliases: [
                'urbandictionary',
                'urbandefine',
                'urbandefinition'
            ],
            group: 'search',
            memberName: 'urban',
            description: 'Searches Urban Dictionary. (;urban Cat)',
            examples: [';urban Cat']
        });
    }

    async run(message) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        console.log("[Command] " + message.content);
        let wordToDefine = message.content.split(" ").slice(1).join(" ");
        urban(wordToDefine).first(function(response) {
            if (response === undefined) {
                message.channel.send(":x: Error! Word not found!");
            }
            else if (response.definition === '') {
                message.channel.send(":x: Error! Word has no definition!");
            }
            else if (response.example !== '') {
                const embed = new Discord.RichEmbed()
                    .setColor(0x32a8f0)
                    .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                    .setURL(response.permalink)
                    .setTitle(response.word)
                    .setDescription(response.definition.substr(0, 1900) + ' [Read the Rest Here!](' + response.permalink + ')')
                    .addField('**Example:**',
                        response.example.substr(0, 1900));
                message.channel.sendEmbed(embed).catch(console.error);
            }
            else {
                const embed = new Discord.RichEmbed()
                    .setColor(0x32a8f0)
                    .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                    .setURL(response.permalink)
                    .setTitle(response.word)
                    .setDescription(response.definition.substr(0, 1900) + ' [Read the Rest Here!](' + response.permalink + ')');
                message.channel.sendEmbed(embed).catch(console.error);
            }
        });
    }
};
