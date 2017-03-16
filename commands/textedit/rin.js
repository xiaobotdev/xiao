const commando = require('discord.js-commando');
const request = require('request-promise');
const config = require('../../config.json');

class RinSayCommand extends commando.Command {
    constructor(Client){
        super(Client, {
            name: 'rin', 
            group: 'textedit',
            memberName: 'rin',
            description: "Posts a message to the Rin webhook in Heroes of Dreamland. (;rin Hey guys!)",
            examples: [";rin Hey guys!"]
        });
    }
	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

    async run(message, args) {
        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(this.client.user).hasPermission('SEND_MESSAGES')) return;
            if(!message.channel.permissionsFor(this.client.user).hasPermission('READ_MESSAGES')) return;
        }
        console.log("[Command] " + message.content);
        let rinContent = message.content.split(" ").slice(1).join(" ");
        const sendPOST = {
            method: 'POST',
            uri: config.webhook,
            body: {
                content: rinContent
            },
            json: true
        }
        request(sendPOST).then(function (parsedBody) {
            if(message.channel.type === 'dm') return;
            message.delete();
        }).catch(function (err) {
            console.log(err);
        });
    }
}

module.exports = RinSayCommand;