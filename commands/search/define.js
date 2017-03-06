const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');

class DefineCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'define', 
            group: 'search',
            memberName: 'define',
            description: 'Defines the first word in your message. (;define Cat)',
            examples: [';define Cat']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let [definethis] = message.content.toLowerCase().split(" ").slice(1);
        const options = {
	        method: 'GET',
	        uri: 'https://owlbot.info/api/v1/dictionary/' + definethis + '?format=json',
  	        json: true
        }
        request(options).then(function (response) {
            const embed = new Discord.RichEmbed()
            .setColor(0x0000FF)
            .setTitle(definethis)
            .setDescription(response[0].defenition);
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! Word not Found!");
        });
    }
}

module.exports = DefineCommand;