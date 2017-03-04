const commando = require('discord.js-commando');
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
                message.channel.sendMessage(":x: Error! Word not found!");
            } else if(json.definition === '') {
                message.channel.sendMessage(":x: Error! Word has no definition!");
            } else if(json.example === '') {
                message.channel.sendMessage("**Definition:**\n" + json.definition, {split:true});
            } else {
                message.channel.sendMessage("**Definition:**\n" + json.definition + "\n\n**Example:**\n" + json.example, {split:true});
            }
        });
    }
}

module.exports = UrbanDictionary;