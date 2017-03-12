const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('request-promise');
const config = require('../../config.json');

class WattpadCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'wattpad', 
            group: 'search',
            memberName: 'wattpad',
            description: 'Searches Wattpad for a specified book. (;wattpad Heroes of Dreamland)',
            examples: [';wattpad Heroes of Dreamland']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return;
        }
        console.log("[Command] " + message.content);
        let querybook = message.content.split(" ").slice(1).join(" ");
        const options = {
	        method: 'GET',
	        uri: 'https://api.wattpad.com:443/v4/stories',
  	        headers: {
    	        'Authorization': 'Basic ' + config.wattpadkey
            },
	        qs: {
    	        query: querybook,
    	        limit: 1
  	        },
            headers: {
                'User-Agent': 'XiaoBot - dragonfire535 (http://dragonfire535.tk)'
            },
  	        json: true
        }
        request(options).then(function (response) {
            const embed = new Discord.RichEmbed()
            .setColor(0xF89C34)
            .setAuthor('Wattpad', 'http://www.selfpubtoolbox.com/wp-content/uploads/2015/05/a6044fd3a88acd5043860484db972ca6.png')
            .setURL(response.stories[0].url)
            .setTitle(response.stories[0].title)
            .setDescription(response.stories[0].description.substr(0, 1500) + "... [Read the Rest Here!](" + response.stories[0].url + ")")
            .addField('**Author:**',
            response.stories[0].user, true)
            .addField('**Parts:**',
            response.stories[0].numParts, true)
            .addField('**Created On:**',
            response.stories[0].createDate, true)
            .addField('**Votes:**',
            response.stories[0].voteCount, true)
            .addField('**Reads:**',
            response.stories[0].readCount, true)
            .addField('**Comments:**',
            response.stories[0].commentCount, true);
            message.channel.sendEmbed(embed).catch(console.error);
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error! Book not Found!");
        });
    }
}

module.exports = WattpadCommand;