const commando = require('discord.js-commando');
const request = require('request-promise');
const config = require('../../config.json');

class YodaCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'yoda', 
            group: 'textedit',
            memberName: 'yoda',
            description: 'Converts text to Yoda Speak. (;yoda This is Yoda.)',
            examples: [';yoda This is Yoda.']
        });
    }

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let yodaspeak = message.content.split(" ").slice(1).join("-");
        const options = {
	        method: 'GET',
	        uri: 'https://yoda.p.mashape.com/yoda',
	        qs: {
    	        sentence: yodaspeak
  	        },
            headers: {
                'X-Mashape-Key': config.mashapekey,
                'Accept': "text/plain"
            },
  	        json: true
        } 
        request(options).then(function (response) {
            if(response === undefined) {
                message.channel.sendMessage(':x: Error! Something went wrong! Keep it simple to avoid this error.');
            } else {
                let translated = response.split('-').join(" ");
                message.channel.sendMessage(translated).catch(error => message.channel.sendMessage(':x: Error! Something went wrong! Keep it simple to avoid this error.'));
            }
        }).catch(function (err) {
            message.channel.sendMessage(":x: Error!");
        });
    }
}

module.exports = YodaCommand;