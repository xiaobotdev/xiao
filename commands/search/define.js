const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const config = require('../../config.json');

class DefineCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'define', 
            group: 'search',
            memberName: 'define',
            description: 'Defines a word. (;define Cat)',
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
        let definethis = message.content.toLowerCase().split(" ").slice(1).join("%20");
        const options = {
	        method: 'GET',
	        uri: 'http://api.wordnik.com:80/v4/word.json/' + definethis + '/definitions',
	        qs: {
    	        limit: 1,
                includeRelated: false,
                useCanonical: false,
                includeTags: false,
                api_key: config.wordnikkey
  	        },
  	        json: true
        }
        request(options).then(function (response) {
            const embed = new Discord.RichEmbed()
            .setColor(0x9797FF)
            .setTitle(response[0].word)
            .setDescription(response[0].text);
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! Word not Found!");
        });
    }
}

module.exports = DefineCommand;