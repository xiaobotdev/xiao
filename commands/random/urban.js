const commando = require('discord.js-commando');
const Discord = require('discord.js');
const urban = require('urban');

class UrbanDictionary extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'urban', 
            group: 'random',
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
                message.reply(":x: Error! Word not found!");
            } else if(json.definition === '') {
                message.reply(":x: Error! Word has no definition!");
            } else if(json.example === '') {
                message.channel.sendMessage("**Definition:**\n" + json.definition, {split:{maxLength:1900}});
            } else {
                message.channel.sendMessage("**Definition:**\n" + json.definition + "\n\n**Example:**\n" + json.example, {split:{maxLength:1900}});
            }
        });
    }
}

module.exports = UrbanDictionary;